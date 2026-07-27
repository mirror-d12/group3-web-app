<template>
  <main class="contact-view">
    <!-- タイトル -->
    <header class="page-header">
      <h1 class="page-title">お問い合わせ</h1>

      <div class="title-line"></div>
    </header>

    <!-- フォーム -->
    <section class="contact-form">
      <!-- メールアドレス -->
      <div class="form-group">
        <label class="form-label"> メールアドレス： </label>

        <TextField v-model="email" label="" />
      </div>

      <!-- お問い合わせ内容 -->
      <div class="form-group">
        <label class="form-label"> お問い合わせ内容： </label>

        <v-textarea
          v-model="message"
          variant="outlined"
          hide-details
          rows="10"
          auto-grow
          class="message-textarea"
        />
      </div>

      <!-- 送信ボタン -->
      <div class="button-area">
        <BaseButton
          text="送信"
          color="light-blue"
          :block="false"
          @click="sendContact"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";

import BaseButton from "@/components/common/BaseButton.vue";
import TextField from "@/components/common/TextField.vue";

const email = ref("");

const message = ref("");

function sendContact() {
  // 今回は画面のみなので処理なし
}
</script>

<style scoped>
.contact-view {
  width: min(100%, 760px);

  min-height: 100vh;

  margin: 0 auto;

  padding: 32px 24px 120px;

  box-sizing: border-box;
}

/*=========================
  タイトル
=========================*/

.page-header {
  margin-bottom: 34px;
}

.page-title {
  margin: 0;

  text-align: center;

  font-size: 46px;

  font-weight: 900;

  color: #111111;
}

.title-line {
  width: 100%;

  height: 2px;

  margin-top: 18px;

  background-color: #111111;
}

/*=========================
  フォーム
=========================*/

.contact-form {
  width: min(100%, 620px);

  margin: 0 auto;

  display: flex;

  flex-direction: column;

  gap: 42px;
}

.form-group {
  display: flex;

  flex-direction: column;

  gap: 10px;
}

.form-label {
  font-size: 25px;

  font-weight: 500;

  color: #111111;
}

/*=========================
  TextArea
=========================*/

.message-textarea {
  width: 100%;
}

/* TextArea内部を白色 */

:deep(.message-textarea .v-field) {
  background-color: #ffffff !important;
}

/* 高さ */

:deep(.message-textarea textarea) {
  min-height: 300px;
}

/*=========================
  ボタン
=========================*/

.button-area {
  display: flex;

  justify-content: center;

  margin-top: 10px;
}

/* BaseButtonの幅 */

:deep(.button-area .v-btn) {
  width: 170px;

  height: 50px;

  font-size: 25px;

  font-weight: 700;
}

/*=========================
  スマホ
=========================*/

@media (max-width: 600px) {
  .contact-view {
    padding: 24px 16px 100px;
  }

  .page-title {
    font-size: 36px;
  }

  .contact-form {
    gap: 34px;
  }

  .form-label {
    font-size: 20px;
  }

  :deep(.message-textarea textarea) {
    min-height: 240px;
  }

  :deep(.button-area .v-btn) {
    width: 150px;

    height: 46px;

    font-size: 21px;
  }
}
</style>
