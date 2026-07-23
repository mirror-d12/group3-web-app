<template>
  <section class="todo-list">
    <!-- TODOが0件 -->
    <div v-if="todos.length === 0" class="empty-message">
      <p class="empty-message__title">TODOがありません</p>

      <p class="empty-message__description">
        右上の「TODO追加」ボタンから 新しいTODOを追加してください。
      </p>
    </div>

    <!-- TODO一覧 -->
    <div v-else class="todo-list__items">
      <TodoCard
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @delete="handleDelete"
        @update="handleUpdate"
        @update-progress="handleProgressUpdate"
      />
    </div>
  </section>
</template>

<script setup>
import TodoCard from "./TodoCard.vue";

defineProps({
  todos: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["delete", "update", "update-progress"]);

function handleDelete(todoId) {
  emit("delete", todoId);
}

function handleUpdate(payload) {
  emit("update", payload);
}

function handleProgressUpdate(payload) {
  emit("update-progress", payload);
}
</script>

<style scoped>
.todo-list {
  width: 100%;
}

.todo-list__items {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.empty-message {
  width: 100%;
  min-height: 220px;

  padding: 48px 20px;

  border: 2px dashed #bdbdbd;
  border-radius: 18px;

  background-color: #f8f8f8;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
}

.empty-message__title {
  margin: 0 0 10px;

  color: #555555;
  font-size: 20px;
  font-weight: 700;
}

.empty-message__description {
  margin: 0;

  color: #777777;
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
}

@media (max-width: 600px) {
  .todo-list__items {
    gap: 14px;
  }

  .empty-message {
    min-height: 180px;

    padding: 32px 16px;
  }

  .empty-message__title {
    font-size: 18px;
  }

  .empty-message__description {
    font-size: 14px;
  }
}
</style>
