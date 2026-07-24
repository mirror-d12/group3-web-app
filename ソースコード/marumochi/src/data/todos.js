const now = new Date();

/**
 * 基準日時から指定した時間だけ進めた日時を返します。
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
 * 基準日時から指定した日数だけ進めた日時を返します。
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
 * 基準日時から指定した週数だけ進めた日時を返します。
 *
 * @param {Date} baseDate 基準日時
 * @param {number} weeks 加算する週数
 * @returns {string} ISO形式の日時
 */
function addWeeks(baseDate, weeks) {
  return addDays(baseDate, weeks * 7);
}

/**
 * TODOの初期ダミーデータです。
 *
 * priorityは期限なしTODOだけに設定します。
 *
 * high   ：高
 * medium ：中
 * low    ：低
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

    priority: null,

    progress: 65,

    createdAt: now.toISOString(),

    updatedAt: now.toISOString(),
  },

  {
    id: 2,
    userId: 1,

    title: "図書館基礎特論の課題を提出する",

    hasDeadline: true,
    deadlineAt: addDays(now, 3),

    repeatEnabled: false,
    repeatType: null,

    priority: null,

    progress: 30,

    createdAt: now.toISOString(),

    updatedAt: now.toISOString(),
  },

  {
    id: 3,
    userId: 1,

    title: "プレゼンテーション資料を完成させる",

    hasDeadline: true,
    deadlineAt: addWeeks(now, 1),

    repeatEnabled: true,
    repeatType: "weekly",

    priority: null,

    progress: 0,

    createdAt: now.toISOString(),

    updatedAt: now.toISOString(),
  },

  {
    id: 4,
    userId: 1,

    title: "期限切れ表示の確認用TODO",

    hasDeadline: true,
    deadlineAt: addHours(now, -2),

    repeatEnabled: false,
    repeatType: null,

    priority: null,

    progress: 40,

    createdAt: addDays(now, -2),

    updatedAt: now.toISOString(),
  },

  {
    id: 5,
    userId: 1,

    title: "単語の勉強をする",

    hasDeadline: false,
    deadlineAt: null,

    repeatEnabled: false,
    repeatType: null,

    priority: "high",

    progress: 20,

    createdAt: now.toISOString(),

    updatedAt: now.toISOString(),
  },

  {
    id: 6,
    userId: 1,

    title: "参考書を1章読む",

    hasDeadline: false,
    deadlineAt: null,

    repeatEnabled: false,
    repeatType: null,

    priority: "medium",

    progress: 100,

    createdAt: addDays(now, -1),

    updatedAt: now.toISOString(),
  },

  {
    id: 7,
    userId: 1,

    title: "部屋を整理する",

    hasDeadline: false,
    deadlineAt: null,

    repeatEnabled: false,
    repeatType: null,

    priority: "low",

    progress: 10,

    createdAt: addDays(now, -2),

    updatedAt: now.toISOString(),
  },

  {
    id: 8,
    userId: 1,

    title: "卒業制作のアイデアを整理する",

    hasDeadline: false,
    deadlineAt: null,

    repeatEnabled: false,
    repeatType: null,

    priority: "high",

    progress: 45,

    createdAt: addHours(now, -3),

    updatedAt: now.toISOString(),
  },
];
