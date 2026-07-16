<script setup>
import LoginForm from "../components/LoginForm.vue";
</script>
<template>
  <section class="login-view">
    <h1>ログイン画面</h1>
    <LoginForm />
  </section>
</template>
<style scoped>
.login-view {
  display: grid;
  gap: 24px;
  max-width: 420px;
  margin: 0 auto;
}
</style>
