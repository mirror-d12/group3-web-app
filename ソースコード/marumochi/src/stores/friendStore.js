import { defineStore } from "pinia";

import { defaultFriendRequests, defaultFriendships } from "../data/friends";

import { useUserStore } from "./userStore";

const FRIENDSHIPS_STORAGE_KEY = "todo-manager-friendships";

const FRIEND_REQUESTS_STORAGE_KEY = "todo-manager-friend-requests";

const VALID_REQUEST_STATUSES = ["pending", "accepted", "rejected"];

/**
 * 日付として正しい値か確認します。
 *
 * @param {*} value
 * @returns {boolean}
 */
function isValidDate(value) {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

/**
 * フレンド関係1件を
 * 現在のデータ形式へ整えます。
 *
 * @param {Object} friendship
 * @returns {Object}
 */
function normalizeFriendship(friendship) {
  return {
    id: Number(friendship.id),

    userId1: Number(friendship.userId1),

    userId2: Number(friendship.userId2),

    createdAt: isValidDate(friendship.createdAt)
      ? new Date(friendship.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * フレンド申請1件を
 * 現在のデータ形式へ整えます。
 *
 * @param {Object} request
 * @returns {Object}
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
 *
 * @returns {Array}
 */
function cloneDefaultFriendships() {
  return defaultFriendships
    .filter((friendship) => friendship && typeof friendship === "object")
    .map(normalizeFriendship);
}

/**
 * 初期フレンド申請を複製します。
 *
 * @returns {Array}
 */
function cloneDefaultFriendRequests() {
  return defaultFriendRequests
    .filter((request) => request && typeof request === "object")
    .map(normalizeFriendRequest);
}

/**
 * localStorageから
 * フレンド関係を読み込みます。
 *
 * @returns {Array}
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
 *
 * @returns {Array}
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

/**
 * ユーザー名を取得します。
 *
 * userNameとnameの
 * どちらの形式にも対応します。
 *
 * @param {Object} user
 * @returns {string}
 */
function getUserName(user) {
  return user?.userName ?? user?.name ?? "";
}

/**
 * ユーザーのメールアドレスを取得します。
 *
 * @param {Object} user
 * @returns {string}
 */
function getUserEmail(user) {
  return user?.email ?? "";
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
     * ログイン中ユーザーの
     * フレンド関係データ
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
     *
     * userStoreのusersから
     * ユーザー情報を取得します。
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
     * ログイン中ユーザーが
     * 受信した申請一覧
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
     * ログイン中ユーザーが
     * 送信した申請一覧
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
     * 受信申請に送信者の
     * ユーザー情報を付けます。
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
     * 送信申請に受信者の
     * ユーザー情報を付けます。
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
     * 指定ユーザーと
     * フレンドか判定します。
     */
    isFriend: () => (userId) => {
      const friendStore = useFriendStore();

      return friendStore.currentUserFriendIds.includes(Number(userId));
    },

    /**
     * 指定ユーザーへ送信済みの
     * 申請があるか判定します。
     */
    hasOutgoingRequest: () => (userId) => {
      const friendStore = useFriendStore();

      return friendStore.outgoingPendingRequests.some(
        (request) => Number(request.receiverId) === Number(userId),
      );
    },

    /**
     * 指定ユーザーから受信中の
     * 申請があるか判定します。
     */
    hasIncomingRequest: () => (userId) => {
      const friendStore = useFriendStore();

      return friendStore.incomingPendingRequests.some(
        (request) => Number(request.senderId) === Number(userId),
      );
    },

    /**
     * ユーザー検索関数です。
     *
     * 自分自身は検索結果から除外します。
     * 名前またはメールアドレスで検索します。
     */
    searchUsers: () => (keyword) => {
      const userStore = useUserStore();

      const friendStore = useFriendStore();

      const normalizedKeyword = String(keyword ?? "")
        .trim()
        .toLowerCase();

      if (!normalizedKeyword) {
        return [];
      }

      return userStore.users
        .filter((user) => Number(user.id) !== friendStore.currentUserId)
        .filter((user) => {
          const userName = getUserName(user).toLowerCase();

          const email = getUserEmail(user).toLowerCase();

          return (
            userName.includes(normalizedKeyword) ||
            email.includes(normalizedKeyword)
          );
        })
        .map((user) => ({
          ...user,

          isFriend: friendStore.isFriend(user.id),

          hasOutgoingRequest: friendStore.hasOutgoingRequest(user.id),

          hasIncomingRequest: friendStore.hasIncomingRequest(user.id),
        }));
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
     * フレンド関連データを
     * まとめて保存します。
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
     * 2人のユーザー間に
     * フレンド関係があるか取得します。
     */
    getFriendshipBetweenUsers(userId1, userId2) {
      const firstUserId = Number(userId1);

      const secondUserId = Number(userId2);

      return (
        this.friendships.find((friendship) => {
          const relation1 =
            Number(friendship.userId1) === firstUserId &&
            Number(friendship.userId2) === secondUserId;

          const relation2 =
            Number(friendship.userId1) === secondUserId &&
            Number(friendship.userId2) === firstUserId;

          return relation1 || relation2;
        }) ?? null
      );
    },

    /**
     * IDでフレンド申請を取得します。
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
     * 存在するか取得します。
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
     * フレンド関連データを
     * 初期状態へ戻します。
     *
     * 開発・動作確認用です。
     */
    resetFriendData() {
      this.friendships = cloneDefaultFriendships();

      this.friendRequests = cloneDefaultFriendRequests();

      this.saveAll();
    },
  },
});
