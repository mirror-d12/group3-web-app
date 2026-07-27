import { defineStore } from "pinia";

import { defaultFriendRequests, defaultFriendships } from "../data/friends";

import { useUserStore } from "./userStore";

const FRIENDSHIPS_STORAGE_KEY = "todo-manager-friendships";

const FRIEND_REQUESTS_STORAGE_KEY = "todo-manager-friend-requests";

const VALID_REQUEST_STATUSES = ["pending", "accepted", "rejected"];

/**
 * 日付として正しい値か確認します。
 */
function isValidDate(value) {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

/**
 * ユーザー名を取得します。
 */
function getUserName(user) {
  return user?.userName ?? user?.name ?? "";
}

/**
 * メールアドレスを取得します。
 */
function getUserEmail(user) {
  return String(user?.email ?? "");
}

/**
 * フレンド関係データを
 * 現在の形式へ整えます。
 */
function normalizeFriendship(friendship) {
  return {
    id: Number(friendship.id),

    userId1: Number(friendship.userId1),

    userId2: Number(friendship.userId2),

    /*
     * 古いデータに項目がない場合は
     * ONを初期値にします。
     */
    notificationEnabledByUser1: friendship.notificationEnabledByUser1 !== false,

    notificationEnabledByUser2: friendship.notificationEnabledByUser2 !== false,

    createdAt: isValidDate(friendship.createdAt)
      ? new Date(friendship.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * フレンド申請データを
 * 現在の形式へ整えます。
 */
function normalizeFriendRequest(request) {
  const status = VALID_REQUEST_STATUSES.includes(request.status)
    ? request.status
    : "pending";

  return {
    id: Number(request.id),

    senderId: Number(request.senderId),

    receiverId: Number(request.receiverId),

    status,

    createdAt: isValidDate(request.createdAt)
      ? new Date(request.createdAt).toISOString()
      : new Date().toISOString(),

    respondedAt: isValidDate(request.respondedAt)
      ? new Date(request.respondedAt).toISOString()
      : null,
  };
}

/**
 * 初期フレンド関係を複製します。
 */
function cloneDefaultFriendships() {
  return defaultFriendships
    .filter((friendship) => friendship && typeof friendship === "object")
    .map(normalizeFriendship);
}

/**
 * 初期フレンド申請を複製します。
 */
function cloneDefaultFriendRequests() {
  return defaultFriendRequests
    .filter((request) => request && typeof request === "object")
    .map(normalizeFriendRequest);
}

/**
 * localStorageから
 * フレンド関係を読み込みます。
 */
function loadFriendships() {
  const savedData = localStorage.getItem(FRIENDSHIPS_STORAGE_KEY);

  if (!savedData) {
    return cloneDefaultFriendships();
  }

  try {
    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return cloneDefaultFriendships();
    }

    return parsedData
      .filter((friendship) => friendship && typeof friendship === "object")
      .map(normalizeFriendship);
  } catch (error) {
    console.error("フレンドデータの読み込みに失敗しました。", error);

    return cloneDefaultFriendships();
  }
}

/**
 * localStorageから
 * フレンド申請を読み込みます。
 */
function loadFriendRequests() {
  const savedData = localStorage.getItem(FRIEND_REQUESTS_STORAGE_KEY);

  if (!savedData) {
    return cloneDefaultFriendRequests();
  }

  try {
    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return cloneDefaultFriendRequests();
    }

    return parsedData
      .filter((request) => request && typeof request === "object")
      .map(normalizeFriendRequest);
  } catch (error) {
    console.error("フレンド申請データの読み込みに失敗しました。", error);

    return cloneDefaultFriendRequests();
  }
}

export const useFriendStore = defineStore("friend", {
  state: () => ({
    friendships: loadFriendships(),

    friendRequests: loadFriendRequests(),
  }),

  getters: {
    /**
     * ログイン中ユーザーのID
     */
    currentUserId() {
      const userStore = useUserStore();

      const id = userStore.currentUser?.id;

      if (id === undefined || id === null) {
        return null;
      }

      return Number(id);
    },

    /**
     * ログイン中ユーザーに関係する
     * フレンド関係一覧
     */
    currentUserFriendships() {
      if (this.currentUserId === null) {
        return [];
      }

      return this.friendships.filter(
        (friendship) =>
          Number(friendship.userId1) === this.currentUserId ||
          Number(friendship.userId2) === this.currentUserId,
      );
    },

    /**
     * ログイン中ユーザーの
     * フレンドID一覧
     */
    currentUserFriendIds() {
      if (this.currentUserId === null) {
        return [];
      }

      return this.currentUserFriendships
        .map((friendship) => {
          if (Number(friendship.userId1) === this.currentUserId) {
            return Number(friendship.userId2);
          }

          return Number(friendship.userId1);
        })
        .filter((id) => !Number.isNaN(id));
    },

    /**
     * ログイン中ユーザーの
     * フレンド一覧
     */
    currentUserFriends() {
      const userStore = useUserStore();

      return this.currentUserFriendIds
        .map((friendId) =>
          userStore.users.find((user) => Number(user.id) === Number(friendId)),
        )
        .filter(Boolean)
        .sort((a, b) => getUserName(a).localeCompare(getUserName(b), "ja"));
    },

    /**
     * 受信中の申請一覧
     */
    incomingPendingRequests() {
      if (this.currentUserId === null) {
        return [];
      }

      return this.friendRequests
        .filter(
          (request) =>
            Number(request.receiverId) === this.currentUserId &&
            request.status === "pending",
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    },

    /**
     * 送信中の申請一覧
     */
    outgoingPendingRequests() {
      if (this.currentUserId === null) {
        return [];
      }

      return this.friendRequests
        .filter(
          (request) =>
            Number(request.senderId) === this.currentUserId &&
            request.status === "pending",
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    },

    /**
     * 受信申請に送信者情報を付けます。
     */
    incomingRequestsWithUsers() {
      const userStore = useUserStore();

      return this.incomingPendingRequests.map((request) => {
        const sender = userStore.users.find(
          (user) => Number(user.id) === Number(request.senderId),
        );

        return {
          ...request,
          sender: sender ?? null,
        };
      });
    },

    /**
     * 送信申請に受信者情報を付けます。
     */
    outgoingRequestsWithUsers() {
      const userStore = useUserStore();

      return this.outgoingPendingRequests.map((request) => {
        const receiver = userStore.users.find(
          (user) => Number(user.id) === Number(request.receiverId),
        );

        return {
          ...request,
          receiver: receiver ?? null,
        };
      });
    },

    /**
     * 指定ユーザーが
     * フレンドか判定します。
     */
    isFriend: () => (userId) => {
      const friendStore = useFriendStore();

      return friendStore.currentUserFriendIds.includes(Number(userId));
    },

    /**
     * 指定ユーザーへ
     * 申請済みか判定します。
     */
    hasOutgoingRequest: () => (userId) => {
      const friendStore = useFriendStore();

      return friendStore.outgoingPendingRequests.some(
        (request) => Number(request.receiverId) === Number(userId),
      );
    },

    /**
     * 指定ユーザーから
     * 申請を受信中か判定します。
     */
    hasIncomingRequest: () => (userId) => {
      const friendStore = useFriendStore();

      return friendStore.incomingPendingRequests.some(
        (request) => Number(request.senderId) === Number(userId),
      );
    },

    /**
     * メールアドレス完全一致で
     * ユーザーを検索します。
     */
    searchUserByEmail: () => (email) => {
      const userStore = useUserStore();

      const friendStore = useFriendStore();

      const normalizedEmail = String(email ?? "")
        .trim()
        .toLowerCase();

      if (!normalizedEmail) {
        return null;
      }

      const user = userStore.users.find((targetUser) => {
        const targetEmail = getUserEmail(targetUser).trim().toLowerCase();

        return (
          Number(targetUser.id) !== friendStore.currentUserId &&
          targetEmail === normalizedEmail
        );
      });

      if (!user) {
        return null;
      }

      return {
        ...user,

        isFriend: friendStore.isFriend(user.id),

        hasOutgoingRequest: friendStore.hasOutgoingRequest(user.id),

        hasIncomingRequest: friendStore.hasIncomingRequest(user.id),
      };
    },
  },

  actions: {
    /**
     * フレンド関係を保存します。
     */
    saveFriendships() {
      localStorage.setItem(
        FRIENDSHIPS_STORAGE_KEY,
        JSON.stringify(this.friendships),
      );
    },

    /**
     * フレンド申請を保存します。
     */
    saveFriendRequests() {
      localStorage.setItem(
        FRIEND_REQUESTS_STORAGE_KEY,
        JSON.stringify(this.friendRequests),
      );
    },

    /**
     * 全データを保存します。
     */
    saveAll() {
      this.saveFriendships();
      this.saveFriendRequests();
    },

    /**
     * IDでフレンド関係を取得します。
     */
    getFriendshipById(friendshipId) {
      const numericId = Number(friendshipId);

      return (
        this.friendships.find(
          (friendship) => Number(friendship.id) === numericId,
        ) ?? null
      );
    },

    /**
     * 2人の間のフレンド関係を
     * 取得します。
     */
    getFriendshipBetweenUsers(userId1, userId2) {
      const firstUserId = Number(userId1);

      const secondUserId = Number(userId2);

      return (
        this.friendships.find((friendship) => {
          const direction1 =
            Number(friendship.userId1) === firstUserId &&
            Number(friendship.userId2) === secondUserId;

          const direction2 =
            Number(friendship.userId1) === secondUserId &&
            Number(friendship.userId2) === firstUserId;

          return direction1 || direction2;
        }) ?? null
      );
    },

    /**
     * IDで申請を取得します。
     */
    getRequestById(requestId) {
      const numericId = Number(requestId);

      return (
        this.friendRequests.find(
          (request) => Number(request.id) === numericId,
        ) ?? null
      );
    },

    /**
     * 2人の間に申請中データが
     * あるか取得します。
     */
    getPendingRequestBetweenUsers(userId1, userId2) {
      const firstUserId = Number(userId1);

      const secondUserId = Number(userId2);

      return (
        this.friendRequests.find((request) => {
          if (request.status !== "pending") {
            return false;
          }

          const direction1 =
            Number(request.senderId) === firstUserId &&
            Number(request.receiverId) === secondUserId;

          const direction2 =
            Number(request.senderId) === secondUserId &&
            Number(request.receiverId) === firstUserId;

          return direction1 || direction2;
        }) ?? null
      );
    },

    /**
     * フレンド申請を送信します。
     */
    sendFriendRequest(receiverId) {
      const senderId = this.currentUserId;

      const normalizedReceiverId = Number(receiverId);

      if (senderId === null) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      if (Number.isNaN(normalizedReceiverId)) {
        throw new Error("申請先のユーザーが正しくありません。");
      }

      if (senderId === normalizedReceiverId) {
        throw new Error("自分自身にはフレンド申請できません。");
      }

      const userStore = useUserStore();

      const receiverExists = userStore.users.some(
        (user) => Number(user.id) === normalizedReceiverId,
      );

      if (!receiverExists) {
        throw new Error("申請先のユーザーが見つかりません。");
      }

      if (this.getFriendshipBetweenUsers(senderId, normalizedReceiverId)) {
        throw new Error("すでにフレンドです。");
      }

      if (this.getPendingRequestBetweenUsers(senderId, normalizedReceiverId)) {
        throw new Error("すでに申請中、または相手から申請を受信しています。");
      }

      const validIds = this.friendRequests
        .map((request) => Number(request.id))
        .filter((id) => !Number.isNaN(id));

      const nextId = validIds.length === 0 ? 1 : Math.max(...validIds) + 1;

      const newRequest = {
        id: nextId,

        senderId,

        receiverId: normalizedReceiverId,

        status: "pending",

        createdAt: new Date().toISOString(),

        respondedAt: null,
      };

      this.friendRequests.push(newRequest);

      this.saveFriendRequests();

      return newRequest;
    },

    /**
     * 受信したフレンド申請を承認します。
     */
    acceptFriendRequest(requestId) {
      const currentUserId = this.currentUserId;

      if (currentUserId === null) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      const request = this.getRequestById(requestId);

      if (!request) {
        throw new Error("フレンド申請が見つかりません。");
      }

      if (Number(request.receiverId) !== Number(currentUserId)) {
        throw new Error("このフレンド申請を承認する権限がありません。");
      }

      if (request.status !== "pending") {
        throw new Error("このフレンド申請はすでに処理されています。");
      }

      const senderId = Number(request.senderId);

      const receiverId = Number(request.receiverId);

      const existingFriendship = this.getFriendshipBetweenUsers(
        senderId,
        receiverId,
      );

      /*
       * まだフレンドでない場合だけ
       * フレンド関係を追加します。
       */
      let newFriendship = existingFriendship;

      if (!existingFriendship) {
        const validIds = this.friendships
          .map((friendship) => Number(friendship.id))
          .filter((id) => !Number.isNaN(id));

        const nextId = validIds.length === 0 ? 1 : Math.max(...validIds) + 1;

        newFriendship = {
          id: nextId,

          userId1: senderId,
          userId2: receiverId,

          notificationEnabledByUser1: true,

          notificationEnabledByUser2: true,

          createdAt: new Date().toISOString(),
        };

        this.friendships.push(newFriendship);
      }

      request.status = "accepted";

      request.respondedAt = new Date().toISOString();

      this.saveAll();

      return {
        request,
        friendship: newFriendship,
      };
    },

    /**
     * 受信したフレンド申請を拒否します。
     */
    rejectFriendRequest(requestId) {
      const currentUserId = this.currentUserId;

      if (currentUserId === null) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      const request = this.getRequestById(requestId);

      if (!request) {
        throw new Error("フレンド申請が見つかりません。");
      }

      if (Number(request.receiverId) !== Number(currentUserId)) {
        throw new Error("このフレンド申請を拒否する権限がありません。");
      }

      if (request.status !== "pending") {
        throw new Error("このフレンド申請はすでに処理されています。");
      }

      request.status = "rejected";

      request.respondedAt = new Date().toISOString();

      this.saveFriendRequests();

      return request;
    },

    /**
     * 指定フレンドとの
     * 通知共有設定を取得します。
     */
    getNotificationEnabled(friendId) {
      const currentUserId = this.currentUserId;

      if (currentUserId === null) {
        return false;
      }

      const friendship = this.getFriendshipBetweenUsers(
        currentUserId,
        friendId,
      );

      if (!friendship) {
        return false;
      }

      if (Number(friendship.userId1) === currentUserId) {
        return Boolean(friendship.notificationEnabledByUser1);
      }

      return Boolean(friendship.notificationEnabledByUser2);
    },

    /**
     * 指定フレンドとの
     * 通知共有設定を変更します。
     */
    setNotificationEnabled(friendId, enabled) {
      const currentUserId = this.currentUserId;

      if (currentUserId === null) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      const friendship = this.getFriendshipBetweenUsers(
        currentUserId,
        friendId,
      );

      if (!friendship) {
        throw new Error("フレンド関係が見つかりません。");
      }

      const normalizedEnabled = Boolean(enabled);

      if (Number(friendship.userId1) === currentUserId) {
        friendship.notificationEnabledByUser1 = normalizedEnabled;
      } else {
        friendship.notificationEnabledByUser2 = normalizedEnabled;
      }

      this.saveFriendships();

      return normalizedEnabled;
    },

    /**
     * 指定したユーザーとの
     * フレンド関係を解除します。
     */
    removeFriend(friendId) {
      const currentUserId = this.currentUserId;

      const normalizedFriendId = Number(friendId);

      if (currentUserId === null) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      if (Number.isNaN(normalizedFriendId)) {
        throw new Error("解除するフレンドが正しくありません。");
      }

      if (currentUserId === normalizedFriendId) {
        throw new Error("自分自身をフレンド解除することはできません。");
      }

      const friendshipIndex = this.friendships.findIndex((friendship) => {
        const userId1 = Number(friendship.userId1);

        const userId2 = Number(friendship.userId2);

        const direction1 =
          userId1 === currentUserId && userId2 === normalizedFriendId;

        const direction2 =
          userId1 === normalizedFriendId && userId2 === currentUserId;

        return direction1 || direction2;
      });

      if (friendshipIndex === -1) {
        throw new Error("フレンド関係が見つかりません。");
      }

      const removedFriendship = this.friendships[friendshipIndex];

      this.friendships.splice(friendshipIndex, 1);

      /*
       * 2人の間に残っている申請データも
       * 削除します。
       *
       * 解除後に再びメール検索し、
       * 新しい申請を送れるようにします。
       */
      this.friendRequests = this.friendRequests.filter((request) => {
        const senderId = Number(request.senderId);

        const receiverId = Number(request.receiverId);

        const direction1 =
          senderId === currentUserId && receiverId === normalizedFriendId;

        const direction2 =
          senderId === normalizedFriendId && receiverId === currentUserId;

        return !(direction1 || direction2);
      });

      this.saveAll();

      return removedFriendship;
    },
    /**
     * 指定したユーザーとの
     * フレンド関係を解除します。
     */
    removeFriend(friendId) {
      const currentUserId = this.currentUserId;

      const normalizedFriendId = Number(friendId);

      if (currentUserId === null) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      if (Number.isNaN(normalizedFriendId)) {
        throw new Error("解除するフレンドが正しくありません。");
      }

      if (Number(currentUserId) === normalizedFriendId) {
        throw new Error("自分自身をフレンド解除することはできません。");
      }

      const friendshipIndex = this.friendships.findIndex((friendship) => {
        const userId1 = Number(friendship.userId1);

        const userId2 = Number(friendship.userId2);

        return (
          (userId1 === Number(currentUserId) &&
            userId2 === normalizedFriendId) ||
          (userId1 === normalizedFriendId && userId2 === Number(currentUserId))
        );
      });

      if (friendshipIndex === -1) {
        throw new Error("フレンド関係が見つかりません。");
      }

      const removedFriendship = {
        ...this.friendships[friendshipIndex],
      };

      this.friendships.splice(friendshipIndex, 1);

      /*
       * 解除した2人の間に残っている
       * フレンド申請データも削除します。
       * これにより、解除後に再申請できます。
       */
      this.friendRequests = this.friendRequests.filter((request) => {
        const senderId = Number(request.senderId);

        const receiverId = Number(request.receiverId);

        const sameUsers =
          (senderId === Number(currentUserId) &&
            receiverId === normalizedFriendId) ||
          (senderId === normalizedFriendId &&
            receiverId === Number(currentUserId));

        return !sameUsers;
      });

      this.saveAll();

      return removedFriendship;
    },

    /**
     * フレンド関連データを
     * 初期状態へ戻します。
     */
    resetFriendData() {
      this.friendships = cloneDefaultFriendships();

      this.friendRequests = cloneDefaultFriendRequests();

      this.saveAll();
    },
    /**
     * 指定ユーザーに関係する
     * フレンド関係とフレンド申請を
     * すべて削除します。
     */
    deleteUserFriendData(userId) {
      const normalizedUserId = Number(userId);

      if (Number.isNaN(normalizedUserId)) {
        throw new Error("削除するユーザーIDが正しくありません。");
      }

      const friendshipCountBefore = this.friendships.length;

      const requestCountBefore = this.friendRequests.length;

      /*
       * 指定ユーザーが含まれる
       * フレンド関係を削除します。
       */
      this.friendships = this.friendships.filter(
        (friendship) =>
          Number(friendship.userId1) !== normalizedUserId &&
          Number(friendship.userId2) !== normalizedUserId,
      );

      /*
       * 指定ユーザーが送信または受信した
       * フレンド申請を削除します。
       */
      this.friendRequests = this.friendRequests.filter(
        (request) =>
          Number(request.senderId) !== normalizedUserId &&
          Number(request.receiverId) !== normalizedUserId,
      );

      const deletedFriendshipCount =
        friendshipCountBefore - this.friendships.length;

      const deletedRequestCount =
        requestCountBefore - this.friendRequests.length;

      this.saveAll();

      return {
        deletedFriendshipCount,
        deletedRequestCount,
      };
    },
  },
});
