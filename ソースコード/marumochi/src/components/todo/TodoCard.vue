<template>
  <article class="todo-card" :style="cardBackgroundStyle">
    <!-- 通常表示 -->
    <template v-if="!isEditing">
      <div class="todo-card__header">
        <h2 class="todo-title">
          {{ todo.title }}
        </h2>

        <div class="header-buttons">
          <button
            type="button"
            class="icon-button edit-button"
            aria-label="TODOを編集"
            @click="startEditing"
          >
            <img :src="editIcon" alt="" class="edit-icon" />
          </button>

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

      <div v-if="todo.hasDeadline" class="todo-detail">
        <span class="detail-label"> 期限： </span>

        <span class="deadline-text">
          {{ formattedDeadline }}
        </span>
      </div>

      <div v-if="todo.hasDeadline" class="todo-detail">
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

      <div class="progress-area">
        <div class="progress-header">
          <span class="detail-label"> 達成率 </span>

          <span class="progress-value"> {{ todo.progress }}% </span>
        </div>

        <ProgressBar :progress="todo.progress" />
      </div>
    </template>

    <!-- 共通編集フォーム -->
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

import todoBackground from "../../images/todo_background.png";
import deleteIcon from "../../images/delete_todo.png";
import editIcon from "../../images/name_setting.png";

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete", "update"]);

const isEditing = ref(false);

const cardBackgroundStyle = {
  backgroundImage: `url(${todoBackground})`,
};

const formattedDeadline = computed(() => {
  if (!props.todo.hasDeadline || !props.todo.deadlineAt) {
    return "";
  }

  const deadline = new Date(props.todo.deadlineAt);

  if (Number.isNaN(deadline.getTime())) {
    return "期限を取得できません";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(deadline);
});

const hasRepeat = computed(() => Boolean(props.todo.repeatEnabled));

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
</script>

<style scoped>
.todo-card {
  width: 100%;
  min-height: 210px;

  padding: 42px 24px 22px;

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
}

.edit-button:hover {
  background-color: rgba(255, 255, 255, 0.55);
}

.delete-button:hover {
  background-color: rgba(255, 235, 238, 0.7);
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

.progress-area {
  margin-top: 21px;
}

.progress-header {
  margin-bottom: 9px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-value {
  color: #c95a00;
  font-size: 20px;
  font-weight: 700;
}

@media (max-width: 600px) {
  .todo-card {
    min-height: 190px;

    padding: 38px 16px 18px;
  }

  .todo-title {
    font-size: 22px;
  }

  .todo-detail,
  .detail-label,
  .deadline-text,
  .repeat-enabled,
  .repeat-disabled {
    font-size: 17px;
  }

  .progress-value {
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
