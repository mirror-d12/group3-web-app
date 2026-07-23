<template>
  <button
    type="button"
    class="add-todo-button"
    aria-label="TODOを追加"
    @click="$emit('click')"
  >
    <img :src="addIcon" alt="" class="add-icon" />

    <span>TODOを追加</span>
  </button>
</template>

<script setup>
import addIcon from "../../images/todo_add.png";

defineEmits(["click"]);
</script>

<style scoped>
.add-todo-button {
  min-width: 170px;
  height: 52px;

  padding: 0 20px;

  border: none;
  border-radius: 26px;

  display: flex;
  justify-content: center;
  align-items: center;

  gap: 10px;

  background-color: #ffaa00;

  color: #ffffff;
  font-size: 17px;
  font-weight: 700;

  cursor: pointer;

  box-shadow: 0 4px 9px rgba(255, 170, 0, 0.35);

  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.add-todo-button:hover {
  background-color: #ee9e00;
  transform: translateY(-2px);
}

.add-todo-button:focus-visible {
  outline: 3px solid rgba(255, 170, 0, 0.35);
  outline-offset: 3px;
}

.add-icon {
  width: 25px;
  height: 25px;

  object-fit: contain;
}

@media (max-width: 600px) {
  .add-todo-button {
    min-width: 140px;
    height: 46px;

    padding: 0 14px;

    font-size: 14px;
  }

  .add-icon {
    width: 22px;
    height: 22px;
  }
}
</style>
