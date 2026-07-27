<template>
  <main class="mypage-view">
    <header class="page-header">
      <div class="page-title-row">
        <!-- ログアウト -->
        <button
          type="button"
          class="header-icon-button"
          aria-label="ログアウト"
          :disabled="isProcessing"
          @click="openLogoutDialog"
        >
          <img :src="logoutIcon" alt="" class="header-icon" />
        </button>

        <h1 class="page-title">マイページ</h1>

        <!-- アカウント削除 -->
        <button
          type="button"
          class="header-icon-button delete-icon-button"
          aria-label="アカウントを削除"
          :disabled="isProcessing"
          @click="openDeleteAccountDialog"
        >
          <img :src="deleteAccountIcon" alt="" class="header-icon" />
        </button>
      </div>

      <div class="title-line"></div>
    </header>

    <p v-if="!currentUser" class="error-message">
      ログイン中のユーザーが見つかりません。
    </p>

    <template v-else>
      <ProfileCard
        :user="currentUser"
        @edit-name="openNameEditor"
        @edit-avatar="openAvatarSelector"
      />

      <div class="profile-divider"></div>

      <UserStats
        :friend-count="friendCount"
        :login-days="loginDays"
        :total-todo-count="totalTodoCount"
      />

      <UserNameEditor
        v-model="isNameEditorOpen"
        :current-name="currentUser.userName"
        @save="saveUserName"
      />

      <AvatarSelector
        v-model="isAvatarSelectorOpen"
        :current-avatar="currentUser.profileImage"
        @save="saveAvatar"
      />

      <!-- ログアウト確認 -->
      <ConfirmDialog
        v-model="isLogoutDialogOpen"
        title="ログアウト"
        message="ログアウトしますか？"
        @ok="executeLogout"
        @cancel="closeLogoutDialog"
      />

      <!-- アカウント削除確認 -->
      <ConfirmDialog
        v-model="isDeleteAccountDialogOpen"
        title="アカウント削除"
        :message="deleteAccountMessage"
        warning-message="この操作は取り消せません。"
        @ok="executeDeleteAccount"
        @cancel="closeDeleteAccountDialog"
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

import { useRouter } from "vue-router";

import { useFriendStore } from "../stores/friendStore";
import { useTodoStore } from "../stores/todoStore";
import { useUserStore } from "../stores/userStore";

import AvatarSelector from "../components/mypage/AvatarSelector.vue";
import ProfileCard from "../components/mypage/ProfileCard.vue";
import UserNameEditor from "../components/mypage/UserNameEditor.vue";
import UserStats from "../components/mypage/UserStats.vue";
import ConfirmDialog from "../components/common/ConfirmDialog.vue";

import logoutIcon from "../images/logout.png";
import deleteAccountIcon from "../images/delete_account.png";

const router = useRouter();

const userStore = useUserStore();
const todoStore = useTodoStore();
const friendStore = useFriendStore();

const isNameEditorOpen = ref(false);
const isAvatarSelectorOpen = ref(false);

const isLogoutDialogOpen = ref(false);
const isDeleteAccountDialogOpen = ref(false);

const isLoggingOut = ref(false);
const isDeletingAccount = ref(false);

const successMessage = ref("");
const errorMessage = ref("");

const currentUser = computed(() => {
  return userStore.currentUser;
});

const friendCount = computed(() => {
  return friendStore.currentUserFriends.length;
});

const loginDays = computed(() => {
  return Number(currentUser.value?.loginDays ?? 0);
});

const totalTodoCount = computed(() => {
  return Number(currentUser.value?.totalTodoCount ?? 0);
});

const isProcessing = computed(() => {
  return isLoggingOut.value || isDeletingAccount.value;
});

/**
 * アカウント削除ダイアログの
 * 通常メッセージです。
 *
 * \nを使って2行に分けます。
 * 最後の赤い文章は
 * warningMessageとして別に渡します。
 */
const deleteAccountMessage = computed(() => {
  const userName = currentUser.value?.userName ?? "現在のユーザー";

  return (
    `${userName}さんのアカウントを削除しますか？\n` +
    "TODO、フレンド関係、申請情報も削除されます。"
  );
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
    console.error("プロフィール画像変更エラー:", error);

    errorMessage.value =
      error instanceof Error
        ? error.message
        : "プロフィール画像を変更できませんでした。";
  }
}

/**
 * ログアウト確認を開きます。
 */
function openLogoutDialog() {
  if (isProcessing.value) {
    return;
  }

  clearMessages();

  isLogoutDialogOpen.value = true;
}

/**
 * ログアウト確認を閉じます。
 */
function closeLogoutDialog() {
  isLogoutDialogOpen.value = false;
}

/**
 * アカウント削除確認を開きます。
 */
function openDeleteAccountDialog() {
  if (isProcessing.value || !currentUser.value) {
    return;
  }

  clearMessages();

  isDeleteAccountDialogOpen.value = true;
}

/**
 * アカウント削除確認を閉じます。
 */
function closeDeleteAccountDialog() {
  isDeleteAccountDialogOpen.value = false;
}

/**
 * ログアウトを実行します。
 */
async function executeLogout() {
  if (isProcessing.value) {
    return;
  }

  isLoggingOut.value = true;
  errorMessage.value = "";

  try {
    userStore.logout();

    await router.replace("/login");
  } catch (error) {
    console.error("ログアウトエラー:", error);

    errorMessage.value =
      error instanceof Error ? error.message : "ログアウトできませんでした。";
  } finally {
    isLoggingOut.value = false;
  }
}

/**
 * アカウント削除を実行します。
 */
async function executeDeleteAccount() {
  if (isProcessing.value || !currentUser.value) {
    return;
  }

  const userId = Number(currentUser.value.id);

  if (Number.isNaN(userId)) {
    errorMessage.value = "ユーザーIDが正しくありません。";

    return;
  }

  isDeletingAccount.value = true;
  errorMessage.value = "";

  try {
    /*
     * currentUserを削除する前に、
     * 関連データを先に削除します。
     */
    todoStore.deleteTodosByUserId(userId);

    friendStore.deleteUserFriendData(userId);

    userStore.deleteCurrentAccount();

    await router.replace("/login");
  } catch (error) {
    console.error("アカウント削除エラー:", error);

    errorMessage.value =
      error instanceof Error
        ? error.message
        : "アカウントを削除できませんでした。";
  } finally {
    isDeletingAccount.value = false;
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
  margin-bottom: 10px;
}

.page-title-row {
  width: 100%;
  min-height: 60px;

  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 64px;
  align-items: center;

  gap: 12px;
}

.page-title {
  margin: 0;

  color: #111111;
  font-size: 40px;
  font-weight: 800;
  text-align: center;
}

.header-icon-button {
  width: 78px;
  height: 78px;

  padding: 6px;

  border: none;
  border-radius: 18px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: transparent;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.header-icon-button:first-child {
  justify-self: start;
}

.delete-icon-button {
  justify-self: end;
}

.header-icon-button:hover:not(:disabled) {
  background-color: #eeeeee;

  transform: translateY(-1px);
}

.header-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.header-icon-button:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.3);

  outline-offset: 3px;
}

.header-icon {
  width: 62px;
  height: 62px;

  display: block;

  object-fit: contain;
}

.title-line {
  width: 100%;
  height: 2px;

  margin-top: 14px;

  background-color: #111111;
}

.profile-divider {
  width: 100%;
  height: 2px;

  margin: 16px 0 24px;

  background-color: #111111;
}

.success-message,
.error-message {
  margin: 20px 0 0;

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

  .page-title-row {
    grid-template-columns: 52px minmax(0, 1fr) 52px;

    gap: 6px;
  }

  .page-title {
    font-size: 30px;
  }

  .header-icon-button {
    width: 64px;
    height: 64px;

    padding: 4px;
  }

  .header-icon {
    width: 52px;
    height: 52px;
  }

  .profile-divider {
    margin: 12px 0 20px;
  }
}
</style>
