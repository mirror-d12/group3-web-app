<template>
  <main class="todo-view">
    <header class="page-header">
      <h1 class="page-title">TODOリスト</h1>

      <div class="title-line"></div>
    </header>

    <TodoToggle v-model="selectedType" />

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

      <!-- 追加フォーム -->
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

const selectedType = ref("deadline");

const isAdding = ref(false);

const displayedTodos = computed(() => {
  if (selectedType.value === "deadline") {
    return todoStore.currentUserDeadlineTodos;
  }

  return todoStore.currentUserNoDeadlineTodos;
});

const selectedTypeLabel = computed(() =>
  selectedType.value === "deadline" ? "期限ありのTODO" : "期限なしのTODO",
);

watch(selectedType, () => {
  isAdding.value = false;
});

function openAddForm() {
  isAdding.value = true;
}

function closeAddForm() {
  isAdding.value = false;
}

function addTodo(todoData) {
  try {
    todoStore.addTodo(todoData);

    isAdding.value = false;
  } catch (error) {
    window.alert(
      error instanceof Error ? error.message : "TODOを追加できませんでした。",
    );
  }
}

function updateTodo(payload) {
  try {
    const success = todoStore.updateTodo(payload.id, payload.updates);

    if (!success) {
      window.alert("TODOを更新できませんでした。");
    }
  } catch (error) {
    window.alert(
      error instanceof Error ? error.message : "TODOを更新できませんでした。",
    );
  }
}

function updateProgress(payload) {
  try {
    const success = todoStore.updateProgress(payload.id, payload.progress);

    if (!success) {
      window.alert("達成率を更新できませんでした。");
    }
  } catch (error) {
    window.alert(
      error instanceof Error ? error.message : "達成率を更新できませんでした。",
    );
  }
}

function deleteTodo(todoId) {
  const targetTodo = todoStore.getTodoById(todoId);

  if (!targetTodo) {
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
  min-height: 58px;
  margin-bottom: 16px;

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
  flex-shrink: 0;

  padding: 5px 13px;

  background-color: #e3f2fd;
  border-radius: 16px;

  color: #1565c0;
  font-size: 16px;
  font-weight: 700;
  text-align: center;

  box-sizing: border-box;
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
    align-items: center;

    gap: 9px;
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
}
</style>
