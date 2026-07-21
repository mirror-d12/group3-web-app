<template>
  <footer class="footer">
    <img class="background" src="../../images/footer_background.png" alt="" />

    <div class="menu">
      <button @click="move('/home')">
        <img src="../../images/footer_home.png" alt="ホーム" />
      </button>

      <button @click="move('/todo')">
        <img src="../../images/footer_todo.png" alt="TODO" />
      </button>

      <button @click="move('/friend')">
        <img src="../../images/footer_friend.png" alt="フレンド" />
      </button>

      <button @click="move('/mypage')">
        <img src="../../images/footer_profile.png" alt="プロフィール" />
      </button>

      <button @click="move('/contact')">
        <img src="../../images/footer_form.png" alt="問い合わせ" />
      </button>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function move(path) {
  router.push(path);
}
</script>

<style scoped>
.footer {
  position: fixed;

  bottom: 0;

  width: 100%;

  height: 90px;
}

.background {
  width: 100%;

  height: 100%;

  position: absolute;
}

.menu {
  position: relative;

  display: flex;

  justify-content: space-around;

  align-items: center;

  height: 100%;
}

button {
  border: none;

  background: none;

  cursor: pointer;
}

button img {
  width: 45px;
}
</style>
