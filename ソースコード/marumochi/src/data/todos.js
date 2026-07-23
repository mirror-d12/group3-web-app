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
 * TODOの初期ダミーデータです。
 *
 * 確認できる機能
 * ・期限あり／期限なしの切り替え
 * ・締切順ソート
 * ・期限切れ表示
 * ・達成率100%のTODO削除
 * ・繰り返しTODO
 */
export const defaultTodos = [
  {
    id: 1, //TODOの識別番号
    userId: 1, //所有ユーザーのID

    title: "English Centralを100%にする", //TODO名

    hasDeadline: true, //期限あり/なし
    deadlineAt: addDays(now, 1), //実際の期限日時

    repeatEnabled: false, //繰り返しON/OFF
    repeatType: null, //hourly・daily・weekly・monthly・null

    progress: 65, //達成率（0~100）

    createdAt: now.toISOString(), //作成日時
    updatedAt: now.toISOString(), //最終更新日時
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

    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
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

    progress: 100,

    createdAt: addDays(now, -1),
    updatedAt: now.toISOString(),
  },
];
