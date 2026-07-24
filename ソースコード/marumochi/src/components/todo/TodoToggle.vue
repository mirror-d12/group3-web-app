<template>
  <div class="todo-toggle" role="tablist" aria-label="TODOの種類切り替え">
    <button
      type="button"
      role="tab"
      class="toggle-button"
      :class="{
        'toggle-button--active': modelValue === 'deadline',
      }"
      :aria-selected="modelValue === 'deadline'"
      @click="changeType('deadline')"
    >
      期限あり
    </button>

    <button
      type="button"
      role="tab"
      class="toggle-button"
      :class="{
        'toggle-button--active': modelValue === 'noDeadline',
      }"
      :aria-selected="modelValue === 'noDeadline'"
      @click="changeType('noDeadline')"
    >
      期限なし
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: "deadline",
    validator(value) {
      return ["deadline", "noDeadline"].includes(value);
    },
  },
});

const emit = defineEmits(["update:modelValue"]);

function changeType(type) {
  emit("update:modelValue", type);
}
</script>

<style scoped>
.todo-toggle {
  width: min(100%, 500px);
  height: 56px;

  margin: 0 auto;
  padding: 5px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);

  background-color: #ffffff;
  border: 2px solid #1597e5;
  border-radius: 28px;

  box-sizing: border-box;
}

.toggle-button {
  width: 100%;
  height: 42px;

  border: none;
  border-radius: 22px;

  background-color: #ffffff;

  color: #1597e5;
  font-size: 18px;
  font-weight: bold;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.toggle-button--active {
  background-color: #1597e5;
  color: #ffffff;

  box-shadow: 0 2px 8px rgba(21, 151, 229, 0.3);
}

.toggle-button:hover:not(.toggle-button--active) {
  background-color: #eaf7fd;
}

.toggle-button:focus-visible {
  outline: 3px solid rgba(21, 151, 229, 0.3);
  outline-offset: 2px;
}

@media (max-width: 600px) {
  .todo-toggle {
    height: 52px;
  }

  .toggle-button {
    height: 38px;
    font-size: 16px;
  }
}
</style>
