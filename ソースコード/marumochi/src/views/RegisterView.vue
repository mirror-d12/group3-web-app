<template>
  <div class="register-view">
    <div class="register-form">
      <!-- タイトル -->
      <h1 class="title">新規登録</h1>

      <!-- 区切り線 -->
      <div class="title-line"></div>

      <!-- ユーザー名 -->
      <div class="input-area">
        <TextField v-model="userName" label="ユーザー名" />
      </div>

      <!-- メールアドレス -->
      <div class="input-area">
        <TextField v-model="email" label="メールアドレス" />
      </div>

      <!-- パスワード -->
      <div class="input-area">
        <PasswordField v-model="password" label="パスワード" />
      </div>

      <!-- パスワード確認 -->
      <div class="input-area">
        <PasswordField v-model="confirmPassword" label="パスワード（確認）" />
      </div>

      <!-- エラーメッセージ -->
      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <!-- 登録ボタン -->
      <div class="button-area">
        <BaseButton text="新規登録" @click="register" />
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
import PasswordField from "../components/common/PasswordField.vue";

const router = useRouter();
const userStore = useUserStore();

// 入力値
const userName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// エラーメッセージ
const errorMessage = ref("");

/**
 * 新規登録
 */
function register() {
  // ユーザー名
  if (!userName.value.trim()) {
    errorMessage.value = "ユーザー名を入力してください。";
    return;
  }

  // メールアドレス
  if (!email.value.trim()) {
    errorMessage.value = "メールアドレスを入力してください。";
    return;
  }

  // パスワード
  if (!password.value.trim()) {
    errorMessage.value = "パスワードを入力してください。";
    return;
  }

  // 確認用パスワード
  if (!confirmPassword.value.trim()) {
    errorMessage.value = "確認用パスワードを入力してください。";
    return;
  }

  // パスワード一致確認
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "パスワードが一致しません。";
    return;
  }

  // 新規登録
  const success = userStore.register(
    userName.value,
    email.value,
    password.value,
  );

  if (success) {
    errorMessage.value = "";

    alert("新規登録が完了しました。");

    router.push("/login");
  } else {
    errorMessage.value = "このメールアドレスは既に登録されています。";
  }
}
</script>

<style scoped>
.register-view {
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #ffffff;
}

.register-form {
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

  margin-bottom: 30px;
}

.input-area {
  width: 100%;
  margin-bottom: 20px;
}

.button-area {
  width: 100%;
  margin-top: 10px;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  min-height: 20px;
  margin-bottom: 10px;
}

.link-area {
  margin-top: 20px;
}

.link {
  color: #1976d2;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .register-form {
    width: 90%;
  }

  .title {
    font-size: 28px;
  }
}
</style>
