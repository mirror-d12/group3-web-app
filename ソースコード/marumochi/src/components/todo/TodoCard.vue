<template>
  <article class="todo-card" :style="cardBackgroundStyle">
    <!-- 通常表示 -->
    <template v-if="!isEditing">
      <div class="todo-card__header">
        <h2 class="todo-title">
          {{ todo.title }}
        </h2>

        <div class="header-buttons">
          <!-- 編集 -->
          <button
            type="button"
            class="icon-button edit-button"
            aria-label="TODOを編集"
            @click="startEditing"
          >
            <img :src="editIcon" alt="" class="edit-icon" />
          </button>

          <!-- 削除 -->
          <button
            type="button"
            class="icon-button delete-button"
            aria-label="TODOを削除"
            @click="requestDelete"
          >
            <img :src="deleteIcon" alt="" class="delete-icon" />
          </button>
        </div>
      </div>

      <!-- 期限ありTODO -->
      <template v-if="todo.hasDeadline">
        <div class="todo-detail">
          <span class="detail-label"> 期限： </span>

          <span class="deadline-text">
            {{ formattedDeadline }}
          </span>
        </div>

        <div class="todo-detail">
          <span class="detail-label"> 繰り返し： </span>

          <span
            :class="{
              'repeat-enabled': hasRepeat,
              'repeat-disabled': !hasRepeat,
            }"
          >
            {{ repeatLabel }}
          </span>
        </div>
      </template>

      <!-- 期限なしTODO -->
      <div v-else class="todo-detail">
        <span class="detail-label"> 優先度： </span>

        <span
          class="priority-text"
          :class="`priority-text--${normalizedPriority}`"
        >
          {{ priorityLabel }}
        </span>
      </div>

      <!-- 達成率 -->
      <div class="progress-area">
        <div class="progress-header">
          <span class="detail-label"> 達成率 </span>
        </div>

        <ProgressBar
          :progress="todo.progress"
          editable
          :aria-label="`${todo.title}の達成率`"
          @update:progress="updateProgress"
        />

        <p v-if="isCompleted" class="completed-message">達成済み</p>
      </div>
    </template>

    <!-- 編集フォーム -->
    <template v-else>
      <TodoForm
        mode="edit"
        :has-deadline="todo.hasDeadline"
        :initial-todo="todo"
        @submit="saveEditing"
        @cancel="cancelEditing"
      />
    </template>
  </article>
</template>

<script setup>
import { computed, ref } from "vue";

import ProgressBar from "../common/ProgressBar.vue";
import TodoForm from "./TodoForm.vue";

import limitTodoBackground from "../../images/LimitTodo_background.png";
import noLimitTodoBackground from "../../images/NolimitTodo_background.png";
import doneTodoBackground from "../../images/DoneTodo_background.png";

import deleteIcon from "../../images/delete_todo.png";
import editIcon from "../../images/name_setting.png";

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete", "update", "update-progress"]);

const isEditing = ref(false);

/**
 * 達成済みかどうかを判定します。
 */
const isCompleted = computed(() => {
  return Number(props.todo.progress) === 100;
});

/**
 * TODOの種類に応じて背景画像を切り替えます。
 *
 * 優先順位：
 * 1. 達成済み
 * 2. 期限あり
 * 3. 期限なし
 */
const cardBackgroundStyle = computed(() => {
  if (isCompleted.value) {
    return {
      backgroundImage: `url(${doneTodoBackground})`,
    };
  }

  if (props.todo.hasDeadline) {
    return {
      backgroundImage: `url(${limitTodoBackground})`,
    };
  }

  return {
    backgroundImage: `url(${noLimitTodoBackground})`,
  };
});

/**
 * 期限表示を作成します。
 */
const formattedDeadline = computed(() => {
  if (!props.todo.hasDeadline || !props.todo.deadlineAt) {
    return "";
  }

  const deadline = new Date(props.todo.deadlineAt);

  if (Number.isNaN(deadline.getTime())) {
    return "期限を取得できません";
  }

  const now = new Date();

  const remainingMilliseconds = deadline.getTime() - now.getTime();

  if (remainingMilliseconds <= 0) {
    return "期限切れ";
  }

  const millisecondsPerHour = 1000 * 60 * 60;

  const millisecondsPerDay = millisecondsPerHour * 24;

  const remainingDays = Math.floor(remainingMilliseconds / millisecondsPerDay);

  const remainingHours = Math.floor(
    (remainingMilliseconds % millisecondsPerDay) / millisecondsPerHour,
  );

  const year = deadline.getFullYear();

  const month = String(deadline.getMonth() + 1).padStart(2, "0");

  const day = String(deadline.getDate()).padStart(2, "0");

  const hour = String(deadline.getHours()).padStart(2, "0");

  const minute = String(deadline.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}年/${month}月/` + `${day}日 ${hour}:${minute}`;

  if (remainingDays > 0) {
    return (
      `あと${remainingDays}日` +
      `${remainingHours}時間` +
      `（${formattedDate}）`
    );
  }

  return `あと${remainingHours}時間` + `（${formattedDate}）`;
});

/**
 * 繰り返し設定の有無
 */
const hasRepeat = computed(() => {
  return Boolean(props.todo.repeatEnabled);
});

/**
 * 繰り返し表示
 */
const repeatLabel = computed(() => {
  if (!hasRepeat.value) {
    return "なし";
  }

  const labels = {
    daily: "毎日",
    weekly: "毎週",
    monthly: "毎月",
  };

  return labels[props.todo.repeatType] ?? "なし";
});

/**
 * 優先度の保存値を安全な値へ整えます。
 */
const normalizedPriority = computed(() => {
  const priority = props.todo.priority;

  if (["high", "medium", "low"].includes(priority)) {
    return priority;
  }

  return "medium";
});

/**
 * 優先度の日本語表示
 */
const priorityLabel = computed(() => {
  const labels = {
    high: "高",
    medium: "中",
    low: "低",
  };

  return labels[normalizedPriority.value] ?? "中";
});

function startEditing() {
  isEditing.value = true;
}

function cancelEditing() {
  isEditing.value = false;
}

function saveEditing(todoData) {
  emit("update", {
    id: props.todo.id,
    updates: todoData,
  });

  isEditing.value = false;
}

function requestDelete() {
  emit("delete", props.todo.id);
}

function updateProgress(progress) {
  emit("update-progress", {
    id: props.todo.id,
    progress,
  });
}
</script>

<style scoped>
.todo-card {
  width: 100%;
  min-height: 230px;

  padding: 42px 24px 24px;

  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;

  border-radius: 8px;

  box-sizing: border-box;
}

.todo-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 12px;

  margin-bottom: 14px;
}

.todo-title {
  flex: 1;

  margin: 0;

  color: #111111;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.45;

  overflow-wrap: anywhere;
}

.header-buttons {
  display: flex;
  align-items: center;

  gap: 4px;
}

.icon-button {
  width: 40px;
  height: 40px;

  padding: 5px;

  border: none;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: transparent;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.edit-button:hover {
  background-color: rgba(255, 255, 255, 0.55);

  transform: translateY(-1px);
}

.delete-button:hover {
  background-color: rgba(255, 235, 238, 0.75);

  transform: translateY(-1px);
}

.icon-button:focus-visible {
  outline: 3px solid rgba(21, 151, 229, 0.3);

  outline-offset: 2px;
}

.edit-icon {
  width: 27px;
  height: 27px;

  object-fit: contain;
}

.delete-icon {
  width: 31px;
  height: 31px;

  object-fit: contain;
}

.todo-detail {
  margin-top: 13px;

  color: #111111;
  font-size: 20px;
  line-height: 1.55;
}

.detail-label {
  color: #000000;
  font-size: 20px;
  font-weight: 700;
}

.deadline-text {
  color: #e40303;
  font-size: 20px;
  font-weight: 700;
}

.repeat-enabled {
  color: #12a91a;
  font-size: 20px;
  font-weight: 700;
}

.repeat-disabled {
  color: #000000;
  font-size: 20px;
  font-weight: 400;
}

/* 優先度共通 */
.priority-text {
  font-size: 20px;
  font-weight: 800;
}

/* 優先度：高 */
.priority-text--high {
  color: #e40303;
}

/* 優先度：中 */
.priority-text--medium {
  color: #ffaa00;
}

/* 優先度：低 */
.priority-text--low {
  color: #12a91a;
}

.progress-area {
  margin-top: 22px;
}

.progress-header {
  margin-bottom: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.completed-message {
  width: fit-content;

  margin: 14px auto 0;

  padding: 5px 16px;

  border-radius: 16px;

  background-color: #12a91a;

  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
}

@media (max-width: 600px) {
  .todo-card {
    min-height: 210px;

    padding: 38px 16px 20px;
  }

  .todo-title {
    font-size: 22px;
  }

  .todo-detail,
  .detail-label,
  .deadline-text,
  .repeat-enabled,
  .repeat-disabled,
  .priority-text {
    font-size: 17px;
  }

  .icon-button {
    width: 36px;
    height: 36px;
  }

  .edit-icon {
    width: 24px;
    height: 24px;
  }

  .delete-icon {
    width: 28px;
    height: 28px;
  }
}
</style>
