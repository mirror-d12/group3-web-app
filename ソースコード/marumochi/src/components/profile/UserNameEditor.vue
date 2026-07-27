<template>
  <Teleport to="body">
    <div v-if="modelValue" class="dialog-overlay" @click.self="closeEditor">
      <section
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="name-editor-title"
      >
        <button
          type="button"
          class="close-button"
          aria-label="閉じる"
          @click="closeEditor"
        >
          ×
        </button>

        <h2 id="name-editor-title" class="dialog-title">ユーザー名を変更</h2>

        <label for="new-user-name" class="input-label">
          新しいユーザー名
        </label>

        <input
          id="new-user-name"
          v-model="userName"
          type="text"
          class="name-input"
          maxlength="30"
          autocomplete="nickname"
          @keydown.enter.prevent="saveName"
        />

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <div class="dialog-actions">
          <button type="button" class="cancel-button" @click="closeEditor">
            キャンセル
          </button>

          <button type="button" class="save-button" @click="saveName">
            保存
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  currentName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const userName = ref("");
const errorMessage = ref("");

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      userName.value = props.currentName;

      errorMessage.value = "";
    }
  },
);

function saveName() {
  const trimmedName = userName.value.trim();

  if (!trimmedName) {
    errorMessage.value = "ユーザー名を入力してください。";

    return;
  }

  if (trimmedName.length > 30) {
    errorMessage.value = "ユーザー名は30文字以内で入力してください。";

    return;
  }

  emit("save", trimmedName);
}

function closeEditor() {
  errorMessage.value = "";

  emit("update:modelValue", false);
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;

  padding: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.45);

  box-sizing: border-box;
}

.dialog {
  position: relative;

  width: min(100%, 500px);

  padding: 30px;

  border-radius: 20px;

  background-color: #ffffff;

  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);

  box-sizing: border-box;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 16px;

  width: 38px;
  height: 38px;

  border: none;
  border-radius: 50%;

  background-color: transparent;

  color: #555555;
  font-size: 30px;

  cursor: pointer;
}

.close-button:hover {
  background-color: #eeeeee;
}

.dialog-title {
  margin: 0 0 28px;

  color: #111111;
  font-size: 27px;
  font-weight: 800;
  text-align: center;
}

.input-label {
  display: block;

  margin-bottom: 8px;

  color: #222222;
  font-size: 17px;
  font-weight: 700;
}

.name-input {
  width: 100%;
  height: 50px;

  padding: 8px 13px;

  border: 2px solid #cccccc;
  border-radius: 10px;

  color: #222222;
  font-size: 17px;

  box-sizing: border-box;
}

.name-input:focus {
  border-color: #2563eb;
  outline: none;
}

.error-message {
  margin: 12px 0 0;

  color: #e40303;
  font-size: 14px;
  font-weight: 700;
}

.dialog-actions {
  margin-top: 26px;

  display: flex;
  justify-content: flex-end;

  gap: 12px;
}

.cancel-button,
.save-button {
  min-width: 100px;
  height: 43px;

  border: none;
  border-radius: 22px;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
}

.cancel-button {
  background-color: #eeeeee;
  color: #333333;
}

.save-button {
  background-color: #2563eb;
  color: #ffffff;
}

.save-button:hover {
  background-color: #1d4ed8;
}
</style>
