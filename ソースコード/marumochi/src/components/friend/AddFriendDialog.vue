<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="dialog-overlay"
      role="presentation"
      @click.self="closeDialog"
    >
      <section
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-friend-title"
      >
        <button
          type="button"
          class="close-button"
          aria-label="ダイアログを閉じる"
          @click="closeDialog"
        >
          ×
        </button>

        <h2 id="add-friend-title" class="dialog-title">フレンド追加</h2>

        <div class="title-line"></div>

        <div class="dialog-content">
          <label for="friend-search" class="search-label">
            ユーザー名またはメールアドレス
          </label>

          <input
            id="friend-search"
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="ユーザーを検索"
            disabled
          />

          <p class="coming-message">
            ユーザー検索とフレンド申請は、次のコミットで実装します。
          </p>
        </div>

        <div class="dialog-actions">
          <button type="button" class="cancel-button" @click="closeDialog">
            閉じる
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
});

const emit = defineEmits(["update:modelValue"]);

const searchKeyword = ref("");

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      searchKeyword.value = "";
    }
  },
);

function closeDialog() {
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

  width: min(100%, 520px);

  padding: 30px;

  border-radius: 22px;

  background-color: #ffffff;

  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.25);

  box-sizing: border-box;
}

.close-button {
  position: absolute;
  top: 13px;
  right: 17px;

  width: 38px;
  height: 38px;

  padding: 0;

  border: none;
  border-radius: 50%;

  background-color: transparent;

  color: #444444;
  font-size: 30px;
  line-height: 1;

  cursor: pointer;
}

.close-button:hover {
  background-color: #eeeeee;
}

.dialog-title {
  margin: 0;

  color: #111111;
  font-size: 29px;
  font-weight: 800;
  text-align: center;
}

.title-line {
  width: 100%;
  height: 2px;

  margin: 15px 0 24px;

  background-color: #222222;
}

.dialog-content {
  width: 100%;
}

.search-label {
  display: block;

  margin-bottom: 8px;

  color: #222222;
  font-size: 16px;
  font-weight: 700;
}

.search-input {
  width: 100%;
  height: 50px;

  padding: 8px 13px;

  border: 2px solid #bdbdbd;
  border-radius: 10px;

  background-color: #f4f4f4;

  color: #555555;
  font-size: 16px;

  box-sizing: border-box;
}

.coming-message {
  margin: 17px 0 0;

  padding: 16px;

  border-radius: 10px;

  background-color: #e9fafd;

  color: #087f86;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
}

.dialog-actions {
  margin-top: 24px;

  display: flex;
  justify-content: center;
}

.cancel-button {
  min-width: 120px;
  height: 44px;

  border: none;
  border-radius: 22px;

  background-color: #eeeeee;

  color: #333333;
  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
}

.cancel-button:hover {
  background-color: #dddddd;
}

@media (max-width: 600px) {
  .dialog-overlay {
    padding: 14px;
  }

  .dialog {
    padding: 27px 18px 22px;
  }

  .dialog-title {
    font-size: 24px;
  }
}
</style>
