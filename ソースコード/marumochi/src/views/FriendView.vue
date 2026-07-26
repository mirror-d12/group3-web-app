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

    <!-- 受信した申請 -->
    <section v-if="incomingRequests.length > 0" class="request-section">
      <div class="section-heading">
        <h2 class="section-title">受信した申請</h2>

        <span class="request-count"> {{ incomingRequests.length }}件 </span>
      </div>

      <div class="request-list">
        <FriendRequestCard
          v-for="request in incomingRequests"
          :key="request.id"
          :request="request"
          :processing="processingRequestId === request.id"
          @accept="acceptRequest"
          @reject="rejectRequest"
        />
      </div>
    </section>

    <!-- フレンド一覧 -->
    <section class="friends-section">
      <div class="section-heading">
        <h2 class="section-title">フレンド</h2>

        <span class="friend-count"> {{ friends.length }}人 </span>
      </div>

      <div v-if="friends.length === 0" class="empty-area">
        <p class="empty-title">フレンドがいません</p>

        <p class="empty-description">
          「フレンド追加」から フレンドを探してください。
        </p>
      </div>

      <div v-else class="friend-list">
        <FriendCard
          v-for="friend in friends"
          :key="friend.id"
          :friend="friend"
          :notification-enabled="friendStore.getNotificationEnabled(friend.id)"
          :removing="removingFriendId === friend.id"
          @update:notification-enabled="
            updateNotificationEnabled(friend, $event)
          "
          @remove="removeFriend"
        />
      </div>
    </section>

    <AddFriendDialog v-model="isAddDialogOpen" />
  </main>
</template>

<script setup>
import { computed, ref } from "vue";

import { useFriendStore } from "../stores/friendStore";

import AddFriendDialog from "../components/friend/AddFriendDialog.vue";
import FriendCard from "../components/friend/FriendCard.vue";
import FriendRequestCard from "../components/friend/FriendRequestCard.vue";

const friendStore = useFriendStore();

const isAddDialogOpen = ref(false);

const processingRequestId = ref(null);

const removingFriendId = ref(null);

const friends = computed(() => {
  return friendStore.currentUserFriends;
});

const incomingRequests = computed(() => {
  return friendStore.incomingRequestsWithUsers.filter(
    (request) => request.sender !== null,
  );
});

function openAddDialog() {
  isAddDialogOpen.value = true;
}

function findIncomingRequest(requestId) {
  return (
    incomingRequests.value.find(
      (request) => Number(request.id) === Number(requestId),
    ) ?? null
  );
}

function findFriend(friendId) {
  return (
    friends.value.find((friend) => Number(friend.id) === Number(friendId)) ??
    null
  );
}

/**
 * フレンド申請を承認します。
 */
function acceptRequest(requestId) {
  const targetRequest = findIncomingRequest(requestId);

  if (!targetRequest) {
    window.alert("フレンド申請が見つかりません。");

    return;
  }

  const senderName =
    targetRequest.sender?.userName ??
    targetRequest.sender?.name ??
    "このユーザー";

  const shouldAccept = window.confirm(
    `${senderName}さんの` + "フレンド申請を承認しますか？",
  );

  if (!shouldAccept) {
    return;
  }

  processingRequestId.value = requestId;

  try {
    friendStore.acceptFriendRequest(requestId);

    window.alert(`${senderName}さんと` + "フレンドになりました。");
  } catch (error) {
    console.error("フレンド申請承認エラー:", error);

    window.alert(
      error instanceof Error
        ? error.message
        : "フレンド申請を承認できませんでした。",
    );
  } finally {
    processingRequestId.value = null;
  }
}

/**
 * フレンド申請を拒否します。
 */
function rejectRequest(requestId) {
  const targetRequest = findIncomingRequest(requestId);

  if (!targetRequest) {
    window.alert("フレンド申請が見つかりません。");

    return;
  }

  const senderName =
    targetRequest.sender?.userName ??
    targetRequest.sender?.name ??
    "このユーザー";

  const shouldReject = window.confirm(
    `${senderName}さんの` + "フレンド申請を拒否しますか？",
  );

  if (!shouldReject) {
    return;
  }

  processingRequestId.value = requestId;

  try {
    friendStore.rejectFriendRequest(requestId);

    window.alert(`${senderName}さんの` + "フレンド申請を拒否しました。");
  } catch (error) {
    console.error("フレンド申請拒否エラー:", error);

    window.alert(
      error instanceof Error
        ? error.message
        : "フレンド申請を拒否できませんでした。",
    );
  } finally {
    processingRequestId.value = null;
  }
}

/**
 * フレンドを解除します。
 */
function removeFriend(friendId) {
  const targetFriend = findFriend(friendId);

  if (!targetFriend) {
    window.alert("解除するフレンドが見つかりません。");

    return;
  }

  const friendName =
    targetFriend.userName ?? targetFriend.name ?? "このユーザー";

  const shouldRemove = window.confirm(
    `${friendName}さんとの` + "フレンド関係を解除しますか？",
  );

  if (!shouldRemove) {
    return;
  }

  removingFriendId.value = friendId;

  try {
    friendStore.removeFriend(friendId);

    window.alert(`${friendName}さんとの` + "フレンド関係を解除しました。");
  } catch (error) {
    console.error("フレンド解除エラー:", error);

    window.alert(
      error instanceof Error ? error.message : "フレンド解除に失敗しました。",
    );
  } finally {
    removingFriendId.value = null;
  }
}

/**
 * 通知共有設定を更新します。
 */
async function updateNotificationEnabled(friend, enabled) {
  const previousEnabled = friendStore.getNotificationEnabled(friend.id);

  try {
    friendStore.setNotificationEnabled(friend.id, enabled);

    if (!previousEnabled && enabled) {
      await sendTestNotification(friend);
    }
  } catch (error) {
    console.error("通知共有設定の更新に失敗しました。", error);

    window.alert(
      error instanceof Error
        ? error.message
        : "通知共有設定を変更できませんでした。",
    );
  }
}

async function sendTestNotification(friend) {
  const friendName = friend.userName ?? friend.name ?? "フレンド";

  const title = "TODO達成通知";

  const body = `${friendName}さんが` + "TODOを達成しました！";

  if (!("Notification" in window)) {
    window.alert(body);
    return;
  }

  try {
    let permission = Notification.permission;

    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission === "granted") {
      new Notification(title, {
        body,
      });

      return;
    }

    window.alert(body);
  } catch (error) {
    console.error("通知表示エラー:", error);

    window.alert(body);
  }
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

.request-section {
  width: 100%;

  margin-bottom: 36px;
}

.friends-section {
  width: 100%;
}

.section-heading {
  margin-bottom: 14px;

  display: flex;
  align-items: center;

  gap: 10px;
}

.section-title {
  margin: 0;

  color: #222222;
  font-size: 24px;
  font-weight: 800;
}

.request-count,
.friend-count {
  min-width: 48px;

  padding: 4px 10px;

  border-radius: 14px;

  font-size: 13px;
  font-weight: 800;
  text-align: center;

  box-sizing: border-box;
}

.request-count {
  background-color: #e4fafd;
  color: #008d96;
}

.friend-count {
  background-color: #e8efff;
  color: #2563eb;
}

.request-list,
.friend-list {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 16px;
}

.empty-area {
  width: 100%;
  min-height: 220px;

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

  .request-section {
    margin-bottom: 28px;
  }

  .section-title {
    font-size: 21px;
  }

  .request-list,
  .friend-list {
    gap: 13px;
  }
}
</style>
