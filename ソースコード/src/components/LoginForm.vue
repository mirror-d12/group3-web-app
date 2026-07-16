<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const LOGIN_EMAIL = "test@test.com";
const LOGIN_PASSWORD = "1234";
const LOGIN_ERROR_MESSAGE = "Email または Password が正しくありません。";
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

function handleSubmit() {
  if (email.value === LOGIN_EMAIL && password.value === LOGIN_PASSWORD) {
    errorMessage.value = "";
    router.push({ name: "top" });
    return;
  }
  errorMessage.value = LOGIN_ERROR_MESSAGE;
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <label
      >メールアドレス<input
        v-model="email"
        type="email"
        name="email"
        autocomplete="email"
    /></label>
    <label
      >パスワード<input
        v-model="password"
        type="password"
        name="password"
        autocomplete="current-password"
    /></label>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <button type="submit">ログイン</button>
  </form>
</template>

<style scoped>
.login-form {
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
label {
  display: grid;
  gap: 8px;
  font-weight: 700;
}
input {
  padding: 10px 12px;
  border: 1px solid #bbb;
  border-radius: 6px;
  font: inherit;
}
.error-message {
  margin: 0;
  color: #c62828;
  font-size: 14px;
}
button {
  width: fit-content;
  padding: 10px 16px;
  border: 0;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
</style>
