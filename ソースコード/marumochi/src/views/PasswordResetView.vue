<template>
  <div class="password-reset-view">
    <div class="password-reset-form">
      <!-- タイトル -->
      <h1 class="title">パスワード再設定</h1>

      <!-- 区切り線 -->
      <div class="title-line"></div>

      <!-- 説明 -->
      <p class="description">登録済みのメールアドレスを入力してください。</p>

      <!-- メールアドレス -->
      <div class="input-area">
        <TextField v-model="email" label="メールアドレス" />
      </div>

      <!-- エラーメッセージ -->
      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <!-- 次へボタン -->
      <div class="button-area">
        <BaseButton text="次へ" @click="next" />
      </div>

      <!-- ログイン画面へ戻る -->
      <div class="link-area">
        <router-link to="/login" class="link"> ログイン画面へ戻る </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useUserStore } from "../stores/userStore";

import BaseButton from "../components/common/BaseButton.vue";
import TextField from "../components/common/TextField.vue";

const router = useRouter();
const userStore = useUserStore();

// 入力値
const email = ref("");

// エラーメッセージ
const errorMessage = ref("");

/**
 * 次へボタン押下
 */
function next() {
  // メールアドレス未入力チェック
  if (!email.value.trim()) {
    errorMessage.value = "メールアドレスを入力してください。";
    return;
  }

  // メールアドレス存在確認
  const user = userStore.findUserByEmail(email.value);

  if (!user) {
    errorMessage.value = "登録されていないメールアドレスです。";
    return;
  }

  // エラー解除
  errorMessage.value = "";

  // 新しいパスワード設定画面へ
  router.push({
    path: "/new-password",
    query: {
      email: email.value,
    },
  });
}
</script>
<style scoped>
.password-reset-view {
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #ffffff;
}

.password-reset-form {
  width: 420px;
  max-width: 90%;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #333;

  margin-bottom: 12px;
}

.title-line {
  width: 100%;
  height: 3px;

  background-color: #000;

  margin-bottom: 24px;
}

.description {
  width: 100%;

  font-size: 15px;
  color: #666;

  text-align: left;

  margin-bottom: 20px;
}

.input-area {
  width: 100%;

  margin-bottom: 20px;
}

.button-area {
  width: 100%;

  margin-top: 8px;
}

.error-message {
  width: 100%;

  color: #d32f2f;

  font-size: 14px;

  text-align: center;

  min-height: 20px;

  margin-bottom: 10px;
}

.link-area {
  margin-top: 20px;
}

.link {
  color: #1976d2;

  text-decoration: none;

  font-size: 14px;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .password-reset-form {
    width: 90%;
  }

  .title {
    font-size: 28px;
  }

  .description {
    font-size: 14px;
  }
}
</style>
