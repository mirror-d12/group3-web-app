<template>
  <section class="todo-list">
    <div v-if="todos.length === 0" class="empty-message">
      <p class="empty-message__title">TODOがありません</p>

      <p class="empty-message__description">新しいTODOを追加してください。</p>
    </div>

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

  gap: 16px;
}

.empty-message {
  width: 100%;
  min-height: 220px;

  padding: 48px 20px;

  background-color: #f7f7f7;
  border: 2px dashed #bdbdbd;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  text-align: center;

  box-sizing: border-box;
}

.empty-message__title {
  margin: 0 0 8px;

  color: #555555;
  font-size: 18px;
  font-weight: 700;
}

.empty-message__description {
  margin: 0;

  color: #777777;
  font-size: 14px;
}
</style>
