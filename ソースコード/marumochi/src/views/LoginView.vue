<template>
  <div class="login-view">
    <!-- 背景画像 -->
    <img
      src="../images/login_background.png"
      alt="ログイン背景"
      class="background-image"
    />

    <!-- ログインフォーム -->
    <div class="login-form">
      <!-- タイトル -->
      <h1 class="title">ログイン</h1>

      <div class="input-area">
        <TextField v-model="email" label="メールアドレス" />
      </div>

      <!-- パスワード -->
      <div class="input-area">
        <PasswordField v-model="password" label="パスワード" />
      </div>

      <!-- ログイン状態を保持 -->
      <label class="keep-login-area">
        <input
          v-model="keepLogin"
          type="checkbox"
          class="keep-login-checkbox"
        />

        <span>ログイン状態を保持</span>
      </label>

      <!-- エラーメッセージ -->
      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <!-- ログインボタン -->
      <div class="button-area">
        <BaseButton text="ログイン" @click="login" />
      </div>

      <!-- 新規登録 -->
      <div class="link-area">
        <router-link to="/register" class="link">
          新規登録はこちら
        </router-link>
      </div>

      <!-- パスワード再設定 -->
      <div class="link-area">
        <router-link to="/password-reset" class="link">
          パスワードを忘れた方はこちら
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "../components/common/BaseButton.vue";
import TextField from "../components/common/TextField.vue";
import PasswordField from "../components/common/PasswordField.vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

const router = useRouter();

// 入力値
const email = ref("");
const password = ref("");
const keepLogin = ref(false);

// エラーメッセージ
const errorMessage = ref("");

/**
 * ログインボタン押下
 */
function login() {
  if (!email.value.trim()) {
    errorMessage.value = "メールアドレスを入力してください。";

    return;
  }

  if (!password.value.trim()) {
    errorMessage.value = "パスワードを入力してください。";

    return;
  }

  const success = userStore.login(email.value, password.value, keepLogin.value);

  if (!success) {
    errorMessage.value = "メールアドレスまたはパスワードが違います。";
    return;
  }

  errorMessage.value = "";

  router.push("/home");
}
</script>

<style scoped>
.login-view {
  position: relative;

  width: 100%;

  height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

  overflow: hidden;

  background: #f5f5f5;
}

.background-image {
  width: 402px;

  max-width: 95%;

  height: auto;

  display: block;
}

.login-form {
  position: absolute;

  width: 280px;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 18px;
}

.title {
  font-size: 32px;

  font-weight: bold;

  margin-bottom: 15px;

  color: #333;
}

.input-area {
  width: 100%;
}

.button-area {
  width: 100%;

  margin-top: 10px;
}

.error-message {
  color: red;

  font-size: 14px;

  height: 18px;

  margin: 0;
}

.link-area {
  width: 100%;

  text-align: center;
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
  .background-image {
    width: 95%;
  }

  .login-form {
    position: absolute;

    top: 170px;

    left: 50%;

    transform: translateX(-50%);

    width: 280px;

    display: flex;

    flex-direction: column;

    gap: 18px;

    z-index: 10;
  }

  .title {
    font-size: 28px;
  }

  .keep-login-area {
    width: 100%;

    display: flex;
    align-items: center;

    gap: 8px;

    font-size: 14px;
    color: #333;

    cursor: pointer;
  }

  .keep-login-checkbox {
    width: 18px;
    height: 18px;

    cursor: pointer;
  }
}
</style>
