<template>
  <main class="mypage-view">
    <header class="page-header">
      <h1 class="page-title">マイページ</h1>

      <div class="title-line"></div>
    </header>

    <p v-if="!currentUser" class="error-message">
      ログイン中のユーザーが見つかりません。
    </p>

    <template v-else>
      <!-- プロフィール情報 -->
      <ProfileCard
        :user="currentUser"
        @edit-name="openNameEditor"
        @edit-avatar="openAvatarSelector"
      />

      <!-- ユーザー名編集 -->
      <UserNameEditor
        v-model="isNameEditorOpen"
        :current-name="currentUser.userName"
        @save="saveUserName"
      />

      <!-- アバター選択 -->
      <AvatarSelector
        v-model="isAvatarSelectorOpen"
        :current-avatar="currentUser.profileImage"
        @save="saveAvatar"
      />

      <p v-if="successMessage" class="success-message">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>
    </template>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";

import { useUserStore } from "../stores/userStore";

import AvatarSelector from "../components/mypage/AvatarSelector.vue";
import ProfileCard from "../components/mypage/ProfileCard.vue";
import UserNameEditor from "../components/mypage/UserNameEditor.vue";

const userStore = useUserStore();

const isNameEditorOpen = ref(false);
const isAvatarSelectorOpen = ref(false);

const successMessage = ref("");
const errorMessage = ref("");

const currentUser = computed(() => {
  return userStore.currentUser;
});

function clearMessages() {
  successMessage.value = "";
  errorMessage.value = "";
}

function openNameEditor() {
  clearMessages();
  isNameEditorOpen.value = true;
}

function openAvatarSelector() {
  clearMessages();
  isAvatarSelectorOpen.value = true;
}

function saveUserName(userName) {
  clearMessages();

  try {
    userStore.updateCurrentUserName(userName);

    isNameEditorOpen.value = false;

    successMessage.value = "ユーザー名を変更しました。";
  } catch (error) {
    console.error("ユーザー名変更エラー:", error);

    errorMessage.value =
      error instanceof Error
        ? error.message
        : "ユーザー名を変更できませんでした。";
  }
}

function saveAvatar(profileImage) {
  clearMessages();

  try {
    userStore.updateCurrentUserAvatar(profileImage);

    isAvatarSelectorOpen.value = false;

    successMessage.value = "プロフィール画像を変更しました。";
  } catch (error) {
    console.error("アバター変更エラー:", error);

    errorMessage.value =
      error instanceof Error
        ? error.message
        : "プロフィール画像を変更できませんでした。";
  }
}
</script>

<style scoped>
.mypage-view {
  width: min(100%, 760px);
  min-height: 100vh;

  margin: 0 auto;

  padding: 30px 24px 140px;

  box-sizing: border-box;
}

.page-header {
  margin-bottom: 26px;
}

.page-title {
  margin: 0;

  color: #111111;
  font-size: 40px;
  font-weight: 800;
  text-align: center;
}

.title-line {
  width: 100%;
  height: 2px;

  margin-top: 14px;

  background-color: #111111;
}

.success-message,
.error-message {
  margin: 18px 0 0;

  font-size: 15px;
  font-weight: 700;
  text-align: center;
}

.success-message {
  color: #12a91a;
}

.error-message {
  color: #e40303;
}

@media (max-width: 600px) {
  .mypage-view {
    padding: 24px 14px 120px;
  }

  .page-title {
    font-size: 32px;
  }
}
</style>
