<template>
  <section class="todo-preview">
    <!-- 見出し -->
    <div class="preview-header">
      <h2 class="preview-title">
        {{ title }}
      </h2>

      <div class="header-buttons">
        <button
          v-if="showCompletedActions"
          type="button"
          class="update-button"
          :disabled="completedCount === 0 || isUpdating"
          @click="requestUpdate"
        >
          {{ isUpdating ? '更新中...' : '達成済みを更新' }}
        </button>

        <button type="button" class="view-all-button" @click="moveToTodo">すべて見る</button>
      </div>
    </div>

    <!-- 達成済み件数 -->
    <p v-if="showCompletedActions && completedCount > 0" class="completed-summary">
      達成済みTODOが
      {{ completedCount }}件あります。
    </p>

    <!-- TODOがない場合 -->
    <div v-if="todos.length === 0" class="empty-message">
      {{ emptyMessage }}
    </div>

    <!-- TODO一覧 -->
    <div v-else class="preview-list">
      <article v-for="todo in todos" :key="todo.id" class="preview-card" :style="getCardStyle(todo)">
        <!-- TODO名 -->
        <div class="preview-card__header">
          <h3 class="todo-title">
            {{ todo.title }}
          </h3>
        </div>

        <!-- 期限ありTODO -->
        <template v-if="todo.hasDeadline">
          <p
            class="deadline"
            :class="{
              'deadline--expired': isExpired(todo)
            }"
          >
            期限：
            {{ formatDeadline(todo) }}
          </p>

          <p class="repeat">
            繰り返し：

            <span
              :class="{
                'repeat-enabled': todo.repeatEnabled,
                'repeat-disabled': !todo.repeatEnabled
              }"
            >
              {{ getRepeatLabel(todo) }}
            </span>
          </p>
        </template>

        <!-- 期限なしTODO -->
        <template v-else>
          <p class="priority">
            優先度：

            <span :class="['priority-text', `priority-${normalizedPriority(todo.priority)}`]">
              {{ getPriorityLabel(todo.priority) }}
            </span>
          </p>
        </template>

        <!-- 達成率 -->
        <div class="progress-area">
          <p class="progress-label">達成率</p>

          <ProgressBar
            :progress="todo.progress"
            editable
            :aria-label="`${todo.title}の達成率`"
            @update:progress="updateProgress(todo.id, $event)"
          />

          <p v-if="Number(todo.progress) === 100" class="completed-message">達成済み</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';

import ProgressBar from '../common/ProgressBar.vue';

import limitTodoBackground from '../../images/LimitTodo_background.png';
import noLimitTodoBackground from '../../images/NolimitTodo_background.png';
import doneTodoBackground from '../../images/DoneTodo_background.png';

const props = defineProps({
  /**
   * 一覧タイトル
   */
  title: {
    type: String,
    default: 'TODO'
  },

  /**
   * TODOが0件の場合のメッセージ
   */
  emptyMessage: {
    type: String,
    default: 'TODOはありません。'
  },

  /**
   * 表示するTODO一覧
   */
  todos: {
    type: Array,
    default: () => []
  },

  /**
   * 達成済みTODOの件数
   */
  completedCount: {
    type: Number,
    default: 0
  },

  /**
   * 達成済み更新処理中か
   */
  isUpdating: {
    type: Boolean,
    default: false
  },

  /**
   * 達成済み更新ボタンを表示するか
   */
  showCompletedActions: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update-progress', 'remove-completed']);

const router = useRouter();

/**
 * TODOの種類に応じて
 * 背景画像を切り替えます。
 */
function getCardStyle(todo) {
  if (Number(todo.progress) === 100) {
    return {
      backgroundImage: `url(${doneTodoBackground})`
    };
  }

  if (todo.hasDeadline) {
    return {
      backgroundImage: `url(${limitTodoBackground})`
    };
  }

  return {
    backgroundImage: `url(${noLimitTodoBackground})`
  };
}

/**
 * 期限切れか判定します。
 */
function isExpired(todo) {
  if (!todo.hasDeadline || !todo.deadlineAt) {
    return false;
  }

  const deadline = new Date(todo.deadlineAt);

  if (Number.isNaN(deadline.getTime())) {
    return false;
  }

  return deadline.getTime() <= Date.now();
}

/**
 * 日時を指定形式に整えます。
 */
function formatDateTime(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  const hour = String(date.getHours()).padStart(2, '0');

  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}年/${month}月/` + `${day}日 ${hour}:${minute}`;
}

/**
 * 期限表示を作成します。
 */
function formatDeadline(todo) {
  if (!todo.hasDeadline || !todo.deadlineAt) {
    return '';
  }

  const deadline = new Date(todo.deadlineAt);

  if (Number.isNaN(deadline.getTime())) {
    return '期限を取得できません';
  }

  const remainingMilliseconds = deadline.getTime() - Date.now();

  if (remainingMilliseconds <= 0) {
    return '期限切れ';
  }

  const millisecondsPerHour = 1000 * 60 * 60;

  const millisecondsPerDay = millisecondsPerHour * 24;

  const remainingDays = Math.floor(remainingMilliseconds / millisecondsPerDay);

  const remainingHours = Math.floor((remainingMilliseconds % millisecondsPerDay) / millisecondsPerHour);

  const formattedDate = formatDateTime(deadline);

  if (remainingDays > 0) {
    return `あと${remainingDays}日` + `${remainingHours}時間` + `（${formattedDate}）`;
  }

  return `あと${remainingHours}時間` + `（${formattedDate}）`;
}

/**
 * 繰り返し表示
 */
function getRepeatLabel(todo) {
  if (!todo.repeatEnabled) {
    return 'なし';
  }

  const labels = {
    daily: '毎日',
    weekly: '毎週',
    monthly: '毎月'
  };

  return labels[todo.repeatType] ?? 'なし';
}

/**
 * 優先度を安全な値に整えます。
 */
function normalizedPriority(priority) {
  if (['high', 'medium', 'low'].includes(priority)) {
    return priority;
  }

  return 'medium';
}

/**
 * 優先度の日本語表示
 */
function getPriorityLabel(priority) {
  const labels = {
    high: '高',
    medium: '中',
    low: '低'
  };

  return labels[normalizedPriority(priority)];
}

/**
 * HomeViewへ達成率変更を通知します。
 */
function updateProgress(todoId, progress) {
  emit('update-progress', {
    id: todoId,
    progress: Number(progress)
  });
}

/**
 * 達成済みTODOの更新処理を
 * HomeViewへ通知します。
 */
function requestUpdate() {
  if (props.completedCount === 0 || props.isUpdating) {
    return;
  }

  emit('remove-completed');
}

/**
 * TODO画面へ移動します。
 */
function moveToTodo() {
  router.push('/todo');
}
</script>

<style scoped>
.todo-preview {
  width: 100%;
}

.preview-header {
  margin-bottom: 18px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 16px;
}

.preview-title {
  margin: 0;

  color: #222222;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}

.header-buttons {
  display: flex;
  align-items: center;

  gap: 10px;
}

.update-button,
.view-all-button {
  min-width: 110px;
  height: 40px;

  padding: 0 18px;

  border: none;
  border-radius: 20px;

  color: #ffffff;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.update-button {
  background-color: #12a91a;
}

.update-button:hover:not(:disabled) {
  background-color: #0d8d15;
  transform: translateY(-1px);
}

.update-button:disabled {
  background-color: #bdbdbd;

  cursor: not-allowed;
  opacity: 0.8;
}

.view-all-button {
  background-color: #ffaa00;
}

.view-all-button:hover {
  background-color: #eb9800;
  transform: translateY(-1px);
}

.completed-summary {
  margin: 0 0 16px;

  color: #12a91a;
  font-size: 16px;
  font-weight: 700;
}

.empty-message {
  width: 100%;

  padding: 45px 20px;

  border: 2px dashed #cccccc;
  border-radius: 20px;

  background-color: #fafafa;

  color: #666666;
  font-size: 17px;
  font-weight: 600;
  text-align: center;

  box-sizing: border-box;
}

.preview-list {
  display: flex;
  flex-direction: column;

  gap: 22px;
}

.preview-card {
  width: 100%;
  min-height: 220px;

  padding: 42px 26px 24px;

  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;

  border-radius: 10px;

  box-sizing: border-box;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.preview-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.preview-card__header {
  margin-bottom: 12px;
}

.todo-title {
  margin: 0;

  color: #111111;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.4;

  overflow-wrap: anywhere;
}

.deadline,
.repeat,
.priority {
  margin: 10px 0 0;

  color: #111111;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.6;
}

.deadline {
  color: #e40303;
}

.deadline--expired {
  color: #e40303;
  font-weight: 800;
}

.repeat-enabled {
  color: #12a91a;
  font-weight: 800;
}

.repeat-disabled {
  color: #000000;
  font-weight: 400;
}

.priority-text {
  font-weight: 800;
}

.priority-high {
  color: #e40303;
}

.priority-medium {
  color: #ffaa00;
}

.priority-low {
  color: #12a91a;
}

.progress-area {
  margin-top: 22px;
}

.progress-label {
  margin: 0 0 10px;

  color: #000000;
  font-size: 18px;
  font-weight: 700;
}

.completed-message {
  width: fit-content;

  margin: 12px auto 0;

  padding: 5px 16px;

  border-radius: 18px;

  background-color: #12a91a;

  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
}

@media (max-width: 600px) {
  .preview-header {
    flex-direction: column;
    align-items: stretch;

    gap: 12px;
  }

  .header-buttons {
    width: 100%;

    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .preview-title {
    font-size: 23px;
  }

  .update-button,
  .view-all-button {
    min-width: 95px;
    height: 36px;

    padding: 0 14px;

    font-size: 13px;
  }

  .preview-card {
    min-height: 200px;

    padding: 34px 18px 20px;
  }

  .todo-title {
    font-size: 21px;
  }

  .deadline,
  .repeat,
  .priority {
    font-size: 16px;
  }

  .progress-label {
    font-size: 16px;
  }

  .completed-message {
    font-size: 14px;
  }
}
</style>
