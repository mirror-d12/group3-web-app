<template>
  <div class="new-password-view">
    <div class="new-password-form">
      <!-- タイトル -->
      <h1 class="title">新しいパスワード設定</h1>

      <!-- 区切り線 -->
      <div class="title-line"></div>

      <!-- 説明 -->
      <p class="description">新しいパスワードを入力してください。</p>

      <!-- 新しいパスワード -->
      <div class="input-area">
        <PasswordField v-model="password" label="新しいパスワード" />
      </div>

      <!-- パスワード（確認） -->
      <div class="input-area">
        <PasswordField
          v-model="confirmPassword"
          label="新しいパスワード（確認）"
        />
      </div>

      <!-- エラーメッセージ -->
      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <!-- 更新ボタン -->
      <div class="button-area">
        <BaseButton text="更新" @click="updatePassword" />
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
import { useRouter, useRoute } from "vue-router";

import { useUserStore } from "../stores/userStore";

import BaseButton from "../components/common/BaseButton.vue";
import PasswordField from "../components/common/PasswordField.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 入力値
const password = ref("");
const confirmPassword = ref("");

// エラーメッセージ
const errorMessage = ref("");

/**
 * パスワード更新
 */
function updatePassword() {
  // 新しいパスワード未入力
  if (!password.value.trim()) {
    errorMessage.value = "新しいパスワードを入力してください。";
    return;
  }

  // 確認用パスワード未入力
  if (!confirmPassword.value.trim()) {
    errorMessage.value = "確認用パスワードを入力してください。";
    return;
  }

  // パスワード一致確認
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "パスワードが一致しません。";
    return;
  }

  // メールアドレス取得
  const email = route.query.email;

  // メールアドレスが取得できない場合
  if (!email) {
    errorMessage.value = "メールアドレスが取得できません。";
    return;
  }

  // パスワード更新
  const success = userStore.changePassword(email, password.value);

  if (success) {
    errorMessage.value = "";

    alert("パスワードを変更しました。");

    router.push("/login");
  } else {
    errorMessage.value = "パスワードの変更に失敗しました。";
  }
}
</script>
<style scoped>
.new-password-view {
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #ffffff;
}

.new-password-form {
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
  .new-password-form {
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
