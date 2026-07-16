<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Chat from "@/components/Chat.vue";

const route = useRoute();
const router = useRouter();
const chatId = computed(() => route.params.id);

function goToTop() {
  router.push({ name: "top" });
}
</script>

<template>
  <section class="chat-view">
    <button class="back-button" type="button" @click="goToTop">
      トップへ戻る
    </button>
    <Chat :chat-id="chatId" />
  </section>
</template>

<style scoped>
.chat-view {
  max-width: 420px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

.back-button {
  width: fit-content;
  padding: 0;
  border: 0;
  color: #2f6f56;
  background: transparent;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.back-button:hover {
  text-decoration: underline;
}
</style>
