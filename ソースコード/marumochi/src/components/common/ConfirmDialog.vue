<template>
  <v-dialog v-model="model" max-width="560">
    <v-card class="confirm-dialog-card">
      <!-- タイトル -->
      <v-card-title class="confirm-dialog-title">
        {{ title }}
      </v-card-title>

      <!-- メッセージ -->
      <v-card-text class="confirm-dialog-content">
        <p class="confirm-dialog-message">
          {{ message }}
        </p>

        <!-- 最後の赤い警告文 -->
        <p v-if="warningMessage" class="confirm-dialog-warning">
          {{ warningMessage }}
        </p>
      </v-card-text>

      <!-- ボタン -->
      <v-card-actions class="confirm-dialog-actions">
        <v-btn
          type="button"
          class="dialog-button cancel-button"
          variant="flat"
          @click="cancel"
        >
          キャンセル
        </v-btn>

        <v-btn
          type="button"
          class="dialog-button ok-button"
          variant="flat"
          @click="ok"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const model = defineModel({
  type: Boolean,
  default: false,
});

const emit = defineEmits(["ok", "cancel"]);

defineProps({
  title: {
    type: String,
    default: "確認",
  },

  message: {
    type: String,
    default: "",
  },

  warningMessage: {
    type: String,
    default: "",
  },
});

function ok() {
  emit("ok");

  model.value = false;
}

function cancel() {
  emit("cancel");

  model.value = false;
}
</script>

<style scoped>
.confirm-dialog-card {
  width: 100%;

  padding: 30px 34px 34px;

  border-radius: 24px !important;

  box-sizing: border-box;
}

/*
 * ダイアログタイトル
 */
.confirm-dialog-title {
  padding: 8px 12px 24px !important;

  color: #111111;
  font-size: 30px !important;
  font-weight: 900 !important;
  line-height: 1.4;
  text-align: center;
  white-space: normal;
}

/*
 * メッセージ領域
 */
.confirm-dialog-content {
  padding: 12px 22px 30px !important;

  color: #222222;
  text-align: center;
}

.confirm-dialog-message {
  margin: 0;

  color: #222222;
  font-size: 18px;
  font-weight: 600;
  line-height: 2;

  /*
   * \nによる改行を画面に反映します。
   */
  white-space: pre-line;
}

.confirm-dialog-warning {
  margin: 18px 0 0;

  color: #e40303;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.7;
  text-align: center;
}

/*
 * ボタンをダイアログ中央へ配置
 */
.confirm-dialog-actions {
  padding: 4px 12px 0 !important;

  display: flex;
  justify-content: center !important;
  align-items: center;

  gap: 28px;
}

/*
 * 共通ボタン
 */
.dialog-button {
  min-width: 150px;
  height: 52px;

  border-radius: 26px !important;

  color: #ffffff !important;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0;

  text-transform: none;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.dialog-button:hover {
  transform: translateY(-1px);
}

/*
 * キャンセル：青
 */
.cancel-button {
  background-color: #2563eb !important;
}

.cancel-button:hover {
  background-color: #1d4ed8 !important;
}

/*
 * OK：赤
 */
.ok-button {
  background-color: #e40303 !important;
}

.ok-button:hover {
  background-color: #c40000 !important;
}

@media (max-width: 600px) {
  .confirm-dialog-card {
    padding: 24px 18px 26px;
  }

  .confirm-dialog-title {
    padding-bottom: 18px !important;

    font-size: 25px !important;
  }

  .confirm-dialog-content {
    padding: 8px 8px 24px !important;
  }

  .confirm-dialog-message,
  .confirm-dialog-warning {
    font-size: 16px;
  }

  .confirm-dialog-actions {
    gap: 12px;
  }

  .dialog-button {
    min-width: 0;
    width: 135px;
    height: 48px;

    font-size: 15px;
  }
}

@media (max-width: 360px) {
  .confirm-dialog-actions {
    flex-direction: column;
  }

  .dialog-button {
    width: 100%;
  }
}
</style>
