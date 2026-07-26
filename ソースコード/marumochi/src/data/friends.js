export const defaultFriendships = [
  {
    id: 1,
    userId1: 1,
    userId2: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId1: 1,
    userId2: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    userId1: 1,
    userId2: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    userId1: 1,
    userId2: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    userId1: 1,
    userId2: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    userId1: 1,
    userId2: 7,
    createdAt: new Date().toISOString(),
  },
];

export const defaultFriendRequests = [];

const now = new Date().toISOString();

/**
 * フレンド関係の初期データです。
 *
 * notificationEnabledByUser1:
 * userId1側がuserId2との通知共有を
 * ONにしているかどうか
 *
 * notificationEnabledByUser2:
 * userId2側がuserId1との通知共有を
 * ONにしているかどうか
 */
export const defaultFriendships = [
  {
    id: 1,
    userId1: 1,
    userId2: 2,
    notificationEnabledByUser1: true,
    notificationEnabledByUser2: true,
    createdAt: now,
  },

  {
    id: 2,
    userId1: 1,
    userId2: 3,
    notificationEnabledByUser1: true,
    notificationEnabledByUser2: true,
    createdAt: now,
  },

  {
    id: 3,
    userId1: 1,
    userId2: 4,
    notificationEnabledByUser1: false,
    notificationEnabledByUser2: true,
    createdAt: now,
  },

  {
    id: 4,
    userId1: 1,
    userId2: 5,
    notificationEnabledByUser1: true,
    notificationEnabledByUser2: false,
    createdAt: now,
  },

  {
    id: 5,
    userId1: 1,
    userId2: 6,
    notificationEnabledByUser1: false,
    notificationEnabledByUser2: true,
    createdAt: now,
  },
];

/**
 * フレンド申請の初期データです。
 */
export const defaultFriendRequests = [];
