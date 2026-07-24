<template>
  <button
    type="button"
    class="add-todo-button"
    aria-label="TODOを追加"
    @click="handleClick"
  >
    <img :src="addIcon" alt="" class="add-icon" />

    <span>TODOを追加</span>
  </button>
</template>

<script setup>
import addIcon from "../../images/todo_add.png";

const emit = defineEmits(["click"]);

function handleClick() {
  emit("click");
}
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
}

.add-todo-button:hover {
  background-color: #ee9e00;
}

.add-icon {
  width: 25px;
  height: 25px;

  object-fit: contain;
}
</style>
