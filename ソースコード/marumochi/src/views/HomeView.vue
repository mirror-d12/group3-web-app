<template>
  <main class="home-view">
    <!-- ユーザー情報 -->
    <header class="home-header">
      <div class="welcome-area">
        <p class="welcome-label">おかえりなさい</p>

        <h1 class="user-name">{{ userName }}さん</h1>
      </div>

      <!-- 連続ログイン記録 -->
      <LoginStreakCard :login-days="loginDays" />
    </header>

    <div class="title-line"></div>

    <!-- 猫画像とカウントダウン -->
    <section class="cat-area">
      <div class="countdown-overlay">
        <DailyCountdown />
      </div>

      <img :src="catImage" alt="TODOを応援する猫" class="cat-image" />
    </section>

    <!-- ホーム画面のTODO一覧 -->
    <div class="todo-preview-area">
      <!-- 期限が近いTODO -->
      <TodoPreviewList
        title="期限が近いTODO"
        empty-message="期限ありのTODOはありません。"
        :todos="deadlinePreviewTodos"
        :completed-count="completedTodoCount"
        :is-updating="isUpdating"
        show-completed-actions
        @update-progress="updateProgress"
        @remove-completed="removeCompletedTodos"
      />

      <!-- 優先度が高い期限なしTODO -->
      <TodoPreviewList
        title="優先度が高いTODO"
        empty-message="期限なしのTODOはありません。"
        :todos="priorityPreviewTodos"
        @update-progress="updateProgress"
      />
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useTodoStore } from '../stores/todoStore';
import { useUserStore } from '../stores/userStore';

import LoginStreakCard from '../components/home/LoginStreakCard.vue';
import DailyCountdown from '../components/home/DailyCountdown.vue';
import TodoPreviewList from '../components/home/TodoPreviewList.vue';

import catImage from '../images/cat.png';

const userStore = useUserStore();
const todoStore = useTodoStore();

const isUpdating = ref(false);

/**
 * ログイン中のユーザー名
 */
const userName = computed(() => {
  return userStore.currentUser?.userName ?? userStore.currentUser?.name ?? 'ゲスト';
});

/**
 * 連続ログイン日数
 */
const loginDays = computed(() => {
  return Number(userStore.currentUser?.loginDays ?? userStore.currentUser?.consecutiveLoginDays ?? 0);
});

/**
 * 期限が近い期限ありTODOを
 * 最大3件表示します。
 *
 * 達成済みTODOは一覧から除外します。
 */
const deadlinePreviewTodos = computed(() => {
  return todoStore.currentUserDeadlineTodos.slice(0, 3);
});

/**
 * 優先度が高い期限なしTODOを
 * 最大3件表示します。
 *
 * todoStore側で、
 * 高 → 中 → 低の順に
 * 並び替えられています。
 */
const priorityPreviewTodos = computed(() => {
  return todoStore.currentUserNoDeadlineTodos.slice(0, 3);
});

/**
 * 現在のユーザーが持つ
 * 達成率100％のTODO件数
 */
const completedTodoCount = computed(() => {
  return todoStore.currentUserTodos.filter((todo) => Number(todo.progress) === 100).length;
});

/**
 * ホーム画面から達成率を更新します。
 */
function updateProgress(payload) {
  try {
    const success = todoStore.updateProgress(payload.id, payload.progress);

    if (!success) {
      window.alert('達成率を更新できませんでした。');
    }
  } catch (error) {
    console.error('達成率更新エラー:', error);

    window.alert(error instanceof Error ? error.message : '達成率を更新できませんでした。');
  }
}

/**
 * 達成率100％のTODOを
 * 一括で削除します。
 */
function removeCompletedTodos() {
  if (completedTodoCount.value === 0) {
    window.alert('達成済みのTODOはありません。');

    return;
  }

  const shouldRemove = window.confirm(`達成率100％のTODOを` + `${completedTodoCount.value}件` + `削除しますか？`);

  if (!shouldRemove) {
    return;
  }

  isUpdating.value = true;

  try {
    const result = todoStore.removeCompletedTodosForCurrentUser();

    if (result.deletedCount === 0) {
      window.alert('削除できるTODOはありませんでした。');

      return;
    }

    window.alert(`${result.deletedCount}件の` + `達成済みTODOを削除しました。`);
  } catch (error) {
    console.error('達成済みTODO更新エラー:', error);

    window.alert(error instanceof Error ? error.message : '達成済みTODOを更新できませんでした。');
  } finally {
    isUpdating.value = false;
  }
}
</script>

<style scoped>
.home-view {
  width: min(100%, 760px);
  min-height: 100vh;

  margin: 0 auto;

  padding: 30px 24px 140px;

  box-sizing: border-box;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 20px;
}

.welcome-area {
  min-width: 0;
}

.welcome-label {
  margin: 0 0 4px;

  color: #666666;
  font-size: 16px;
  font-weight: 700;
}

.user-name {
  margin: 0;

  color: #2d1b17;
  font-size: 32px;
  font-weight: 800;

  overflow-wrap: anywhere;
}

.title-line {
  width: 100%;
  height: 3px;

  margin-top: 16px;

  background-color: #222222;
}

/*
 * 猫画像とカウントダウン
 */
.cat-area {
  position: relative;
  z-index: 1;

  width: 100%;
  height: 500px;

  margin-top: 8px;
  margin-bottom: -80px;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  overflow: visible;
}

/*
 * 猫画像はTODO一覧より下のレイヤーです。
 */
.cat-image {
  position: relative;
  z-index: 1;

  width: 560px;
  max-width: none;
  height: auto;

  display: block;

  object-fit: contain;

  user-select: none;
  pointer-events: none;
}

/*
 * カウントダウンは猫画像の上に表示します。
 */
.countdown-overlay {
  position: absolute;
  top: 120px;
  left: 50%;
  z-index: 2;

  width: 100%;

  transform: translateX(-50%);
}

/*
 * TODO一覧は猫画像より前面に表示します。
 */
.todo-preview-area {
  position: relative;
  z-index: 3;

  display: flex;
  flex-direction: column;

  gap: 38px;
}

@media (max-width: 600px) {
  .home-view {
    padding: 24px 14px 120px;
  }

  .home-header {
    align-items: flex-start;

    gap: 10px;
  }

  .welcome-label {
    font-size: 14px;
  }

  .user-name {
    font-size: 25px;
  }

  .cat-area {
    height: 410px;

    margin-top: 4px;
    margin-bottom: -58px;
  }

  .cat-image {
    width: 430px;
  }

  .countdown-overlay {
    top: 75px;
  }

  .todo-preview-area {
    gap: 28px;
  }
}
</style>
