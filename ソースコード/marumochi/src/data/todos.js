const now = new Date();

/**
 * 基準日時から指定した時間を加算した日時を返します。
 *
 * @param {Date} baseDate 基準日時
 * @param {number} hours 加算する時間
 * @returns {string} ISO形式の日時
 */
function addHours(baseDate, hours) {
  const date = new Date(baseDate);
  date.setHours(date.getHours() + hours);

  return date.toISOString();
}

/**
 * 基準日時から指定した日数を加算した日時を返します。
 *
 * @param {Date} baseDate 基準日時
 * @param {number} days 加算する日数
 * @returns {string} ISO形式の日時
 */
function addDays(baseDate, days) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + days);

  return date.toISOString();
}

/**
 * TODOの初期ダミーデータです。
 *
 * 期限あり・期限なしの切り替え、締切順ソート、
 * 期限切れ表示、達成済みTODOの削除を確認できます。
 */
export const defaultTodos = [
  {
    id: 1,
    userId: 1,

    title: "English Centralを100%にする",

    hasDeadline: true,
    deadlineAt: addDays(now, 1),

    repeatEnabled: false,
    repeatType: null,

    progress: 65,
    completed: false,
    completedAt: null,

    createdAt: now.toISOString(),
  },

  {
    id: 2,
    userId: 1,

    title: "図書館基礎特論の課題を提出する",

    hasDeadline: true,
    deadlineAt: addDays(now, 3),

    repeatEnabled: false,
    repeatType: null,

    progress: 30,
    completed: false,
    completedAt: null,

    createdAt: now.toISOString(),
  },

  {
    id: 3,
    userId: 1,

    title: "プレゼンテーション資料を完成させる",

    hasDeadline: true,
    deadlineAt: addDays(now, 7),

    repeatEnabled: true,
    repeatType: "weekly",

    progress: 0,
    completed: false,
    completedAt: null,

    createdAt: now.toISOString(),
  },

  {
    id: 4,
    userId: 1,

    title: "期限切れ表示の確認用TODO",

    hasDeadline: true,
    deadlineAt: addHours(now, -2),

    repeatEnabled: false,
    repeatType: null,

    progress: 40,
    completed: false,
    completedAt: null,

    createdAt: addDays(now, -2),
  },

  {
    id: 5,
    userId: 1,

    title: "単語の勉強をする",

    hasDeadline: false,
    deadlineAt: null,

    repeatEnabled: false,
    repeatType: null,

    progress: 20,
    completed: false,
    completedAt: null,

    createdAt: now.toISOString(),
  },

  {
    id: 6,
    userId: 1,

    title: "参考書を1章読む",

    hasDeadline: false,
    deadlineAt: null,

    repeatEnabled: false,
    repeatType: null,

    progress: 100,
    completed: true,
    completedAt: now.toISOString(),

    createdAt: addDays(now, -1),
  },
];
