<template>
  <main class="friend-view">
    <header class="page-header">
      <h1 class="page-title">フレンドリスト</h1>

      <div class="add-link-area">
        <button type="button" class="add-friend-button" @click="openAddDialog">
          フレンド追加
        </button>
      </div>

      <div class="title-line"></div>
    </header>

    <!-- フレンドがいない場合 -->
    <section v-if="friends.length === 0" class="empty-area">
      <p class="empty-title">フレンドがいません</p>

      <p class="empty-description">
        「フレンド追加」からフレンドを探してください。
      </p>
    </section>

    <!-- フレンド一覧 -->
    <section v-else class="friend-list">
      <FriendCard
        v-for="friend in friends"
        :key="friend.id"
        :friend="friend"
        :notification-enabled="getNotificationEnabled(friend.id)"
        @update:notification-enabled="
          updateNotificationEnabled(friend.id, $event)
        "
      />
    </section>

    <!-- フレンド追加ダイアログ -->
    <AddFriendDialog v-model="isAddDialogOpen" />
  </main>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

import { useFriendStore } from "../stores/friendStore";

import FriendCard from "../components/friend/FriendCard.vue";
import AddFriendDialog from "../components/friend/AddFriendDialog.vue";

const friendStore = useFriendStore();

const isAddDialogOpen = ref(false);

/*
 * コミット②では通知共有状態を
 * 画面内だけで管理します。
 *
 * コミット③でfriendStoreと
 * localStorageへ保存する予定です。
 */
const notificationSettings = reactive({});

/**
 * ログイン中ユーザーの
 * フレンド一覧です。
 */
const friends = computed(() => {
  return friendStore.currentUserFriends;
});

/**
 * フレンド一覧を読み込んだとき、
 * 通知共有設定の初期値を設定します。
 */
watch(
  friends,
  (friendList) => {
    friendList.forEach((friend) => {
      if (notificationSettings[friend.id] === undefined) {
        notificationSettings[friend.id] = true;
      }
    });
  },
  {
    immediate: true,
  },
);

/**
 * フレンド追加ダイアログを開きます。
 */
function openAddDialog() {
  isAddDialogOpen.value = true;
}

/**
 * 指定したフレンドの
 * 通知共有設定を取得します。
 */
function getNotificationEnabled(friendId) {
  return notificationSettings[friendId] ?? true;
}

/**
 * 通知共有設定を画面内で変更します。
 */
function updateNotificationEnabled(friendId, enabled) {
  notificationSettings[friendId] = Boolean(enabled);
}
</script>

<style scoped>
.friend-view {
  width: min(100%, 760px);
  min-height: 100vh;

  margin: 0 auto;

  padding: 34px 24px 140px;

  box-sizing: border-box;
}

.page-header {
  width: 100%;

  margin-bottom: 28px;
}

.page-title {
  margin: 0;

  color: #000000;
  font-size: 40px;
  font-weight: 800;
  line-height: 1.3;
  text-align: center;
}

.add-link-area {
  width: 100%;

  margin-top: 4px;

  display: flex;
  justify-content: flex-end;
}

.add-friend-button {
  padding: 2px 4px;

  border: none;
  background-color: transparent;

  color: #2563eb;
  font-size: 20px;
  font-weight: 500;

  cursor: pointer;
}

.add-friend-button:hover {
  text-decoration: underline;
}

.add-friend-button:focus-visible {
  border-radius: 4px;

  outline: 3px solid rgba(37, 99, 235, 0.25);
  outline-offset: 3px;
}

.title-line {
  width: 100%;
  height: 2px;

  margin-top: 6px;

  background-color: #111111;
}

.friend-list {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 18px;
}

.empty-area {
  width: 100%;
  min-height: 230px;

  padding: 40px 20px;

  border: 2px dashed #bdbdbd;
  border-radius: 18px;

  background-color: #f8f8f8;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  box-sizing: border-box;
}

.empty-title {
  margin: 0 0 8px;

  color: #444444;
  font-size: 21px;
  font-weight: 800;
}

.empty-description {
  margin: 0;

  color: #777777;
  font-size: 15px;
  line-height: 1.6;
}

@media (max-width: 600px) {
  .friend-view {
    padding: 26px 14px 120px;
  }

  .page-header {
    margin-bottom: 22px;
  }

  .page-title {
    font-size: 32px;
  }

  .add-friend-button {
    font-size: 17px;
  }

  .friend-list {
    gap: 14px;
  }
}
</style>
