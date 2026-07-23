<template>
  <main class="todo-view">
    <!-- 画面タイトル -->
    <header class="page-header">
      <h1 class="page-title">TODOリスト</h1>

      <div class="title-line"></div>
    </header>

    <!-- 期限あり・期限なし切り替え -->
    <TodoToggle v-model="selectedType" />

    <!-- TODO一覧 -->
    <section class="list-area">
      <div class="list-heading">
        <div class="list-heading__left">
          <h2 class="list-title">
            {{ selectedTypeLabel }}
          </h2>

          <span class="todo-count"> {{ displayedTodos.length }}件 </span>
        </div>

        <AddTodoButton v-if="!isAdding" @click="openAddForm" />
      </div>

      <!-- 並び順の説明 -->
      <p class="sort-message">
        {{ sortMessage }}
      </p>

      <!-- TODO追加フォーム -->
      <div v-if="isAdding" class="add-form-area">
        <TodoForm
          mode="add"
          :has-deadline="selectedType === 'deadline'"
          @submit="addTodo"
          @cancel="closeAddForm"
        />
      </div>

      <!-- TODO一覧 -->
      <TodoList
        :todos="displayedTodos"
        @delete="deleteTodo"
        @update="updateTodo"
        @update-progress="updateProgress"
      />
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import { useTodoStore } from "../stores/todoStore";

import TodoToggle from "../components/todo/TodoToggle.vue";
import TodoList from "../components/todo/TodoList.vue";
import TodoForm from "../components/todo/TodoForm.vue";
import AddTodoButton from "../components/todo/AddTodoButton.vue";

const todoStore = useTodoStore();

/**
 * 初期表示は期限ありTODOです。
 */
const selectedType = ref("deadline");

/**
 * TODO追加フォームを
 * 開いているかどうかです。
 */
const isAdding = ref(false);

/**
 * 選択中の種類に応じて
 * 表示するTODO一覧を切り替えます。
 */
const displayedTodos = computed(() => {
  if (selectedType.value === "deadline") {
    return todoStore.currentUserDeadlineTodos;
  }

  return todoStore.currentUserNoDeadlineTodos;
});

/**
 * 一覧タイトルを切り替えます。
 */
const selectedTypeLabel = computed(() => {
  return selectedType.value === "deadline"
    ? "期限ありのTODO"
    : "期限なしのTODO";
});

/**
 * 並び順の説明を切り替えます。
 */
const sortMessage = computed(() => {
  return selectedType.value === "deadline"
    ? "期限が近い順に表示しています。"
    : "優先度が高い順に表示しています。";
});

/**
 * 期限あり・期限なしを切り替えたら、
 * 開いている追加フォームを閉じます。
 */
watch(selectedType, () => {
  isAdding.value = false;
});

/**
 * TODO追加フォームを開きます。
 */
function openAddForm() {
  isAdding.value = true;
}

/**
 * TODO追加フォームを閉じます。
 */
function closeAddForm() {
  isAdding.value = false;
}

/**
 * 新しいTODOを追加します。
 */
function addTodo(todoData) {
  try {
    todoStore.addTodo(todoData);

    isAdding.value = false;
  } catch (error) {
    console.error("TODO追加エラー:", error);

    window.alert(
      error instanceof Error ? error.message : "TODOを追加できませんでした。",
    );
  }
}

/**
 * TODO名・期限・繰り返し・優先度を
 * 更新します。
 */
function updateTodo(payload) {
  try {
    const success = todoStore.updateTodo(payload.id, payload.updates);

    if (!success) {
      window.alert("TODOを更新できませんでした。");
    }
  } catch (error) {
    console.error("TODO更新エラー:", error);

    window.alert(
      error instanceof Error ? error.message : "TODOを更新できませんでした。",
    );
  }
}

/**
 * 達成率を更新します。
 */
function updateProgress(payload) {
  try {
    const success = todoStore.updateProgress(payload.id, payload.progress);

    if (!success) {
      window.alert("達成率を更新できませんでした。");
    }
  } catch (error) {
    console.error("達成率更新エラー:", error);

    window.alert(
      error instanceof Error ? error.message : "達成率を更新できませんでした。",
    );
  }
}

/**
 * TODOを削除します。
 */
function deleteTodo(todoId) {
  const targetTodo = todoStore.getTodoById(todoId);

  if (!targetTodo) {
    window.alert("削除するTODOが見つかりませんでした。");

    return;
  }

  const shouldDelete = window.confirm(
    `「${targetTodo.title}」を削除しますか？`,
  );

  if (!shouldDelete) {
    return;
  }

  const success = todoStore.deleteTodo(todoId);

  if (!success) {
    window.alert("TODOを削除できませんでした。");
  }
}
</script>

<style scoped>
.todo-view {
  width: min(100%, 760px);
  min-height: 100vh;

  margin: 0 auto;

  padding: 32px 24px 140px;

  box-sizing: border-box;
}

.page-header {
  margin-bottom: 26px;
}

.page-title {
  margin: 0 0 12px;

  color: #2d1b17;
  font-size: 34px;
  font-weight: 700;
  text-align: center;
}

.title-line {
  width: 100%;
  height: 3px;

  background-color: #222222;
}

.list-area {
  margin-top: 30px;
}

.list-heading {
  width: 100%;
  min-height: 58px;

  margin-bottom: 6px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 16px;
}

.list-heading__left {
  min-width: 0;

  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 14px;
}

.list-title {
  margin: 0;

  color: #222222;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;

  white-space: nowrap;
}

.todo-count {
  min-width: 58px;

  padding: 5px 13px;

  flex-shrink: 0;

  background-color: #e3f2fd;
  border-radius: 16px;

  color: #1565c0;
  font-size: 16px;
  font-weight: 700;
  text-align: center;

  box-sizing: border-box;
}

.sort-message {
  margin: 0 0 18px;

  color: #666666;
  font-size: 14px;
  font-weight: 600;
}

.add-form-area {
  width: 100%;

  margin-bottom: 24px;
}

@media (max-width: 600px) {
  .todo-view {
    padding: 25px 14px 120px;
  }

  .page-title {
    font-size: 28px;
  }

  .list-area {
    margin-top: 24px;
  }

  .list-heading {
    min-height: 52px;

    gap: 8px;
  }

  .list-heading__left {
    flex-direction: row;
    align-items: center;

    gap: 7px;
  }

  .list-title {
    font-size: 20px;
  }

  .todo-count {
    min-width: 44px;

    padding: 4px 7px;

    font-size: 12px;
  }

  .sort-message {
    margin-bottom: 14px;

    font-size: 13px;
  }

  .add-form-area {
    margin-bottom: 18px;
  }
}
</style>
