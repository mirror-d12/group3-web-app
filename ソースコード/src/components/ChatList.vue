<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const chats = [
  {
    id: "xxx",
    title: "xxx chat",
    description: "進捗共有用のチャット",
  },
  {
    id: "yyy",
    title: "yyy chat",
    description: "デザイン確認用のチャット",
  },
  {
    id: "zzz",
    title: "zzz chat",
    description: "デモ相談用のチャット",
  },
];

function openChat(chatId) {
  router.push({ name: "chat", params: { id: chatId } });
}
</script>

<template>
  <div class="chat-selector">
    <button
      v-for="chat in chats"
      :key="chat.id"
      class="chat-card"
      type="button"
      @click="openChat(chat.id)"
    >
      <span class="chat-title">{{ chat.title }}</span>
      <span class="chat-description">{{ chat.description }}</span>
    </button>
  </div>
</template>

<style scoped>
.chat-selector {
  display: grid;
  gap: 16px;
}

.chat-card {
  display: grid;
  gap: 8px;
  width: 100%;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: inherit;
  background: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.chat-card:hover {
  border-color: #42b883;
}

.chat-title {
  font-size: 20px;
  font-weight: 700;
}

.chat-description {
  color: #667085;
}
</style>
