import { defineStore } from "pinia";

import { defaultTodos } from "../data/todos";
import { useUserStore } from "./userStore";

const TODOS_STORAGE_KEY = "todo-manager-todos";

const VALID_REPEAT_TYPES = ["daily", "weekly", "monthly"];

const VALID_PRIORITIES = ["high", "medium", "low"];

/**
 * 達成率を0～100の範囲に収めます。
 *
 * @param {*} progress 達成率
 * @returns {number} 0～100の達成率
 */
function normalizeProgress(progress) {
  const numericProgress = Number(progress);

  if (Number.isNaN(numericProgress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, numericProgress));
}

/**
 * 期限日時として正しい値か確認します。
 *
 * @param {*} dateValue 日時
 * @returns {boolean}
 */
function isValidDate(dateValue) {
  if (!dateValue) {
    return false;
  }

  const date = new Date(dateValue);

  return !Number.isNaN(date.getTime());
}

/**
 * 繰り返し間隔として正しい値か確認します。
 *
 * @param {*} repeatType 繰り返し間隔
 * @returns {boolean}
 */
function isValidRepeatType(repeatType) {
  return VALID_REPEAT_TYPES.includes(repeatType);
}

/**
 * 優先度として正しい値か確認します。
 *
 * @param {*} priority 優先度
 * @returns {boolean}
 */
function isValidPriority(priority) {
  return VALID_PRIORITIES.includes(priority);
}

/**
 * TODOデータ1件を現在のデータ形式へ整えます。
 *
 * 古いlocalStorageにpriorityがない場合も、
 * 期限なしTODOにはmediumを補います。
 *
 * @param {Object} todo TODOデータ
 * @returns {Object}
 */
function normalizeTodo(todo) {
  const hasDeadline = Boolean(todo.hasDeadline);

  const repeatEnabled = hasDeadline && Boolean(todo.repeatEnabled);

  return {
    id: Number(todo.id),

    userId: Number(todo.userId),

    title: typeof todo.title === "string" ? todo.title : "",

    hasDeadline,

    deadlineAt:
      hasDeadline && isValidDate(todo.deadlineAt)
        ? new Date(todo.deadlineAt).toISOString()
        : null,

    repeatEnabled,

    repeatType:
      repeatEnabled && isValidRepeatType(todo.repeatType)
        ? todo.repeatType
        : null,

    /*
     * 優先度は期限なしTODOだけが持ちます。
     * 古いデータにはmediumを設定します。
     */
    priority: hasDeadline
      ? null
      : isValidPriority(todo.priority)
        ? todo.priority
        : "medium",

    progress: normalizeProgress(todo.progress),

    createdAt: isValidDate(todo.createdAt)
      ? new Date(todo.createdAt).toISOString()
      : new Date().toISOString(),

    updatedAt: isValidDate(todo.updatedAt)
      ? new Date(todo.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * 初期TODOを複製し、
 * 現在のデータ形式へ整えます。
 *
 * @returns {Array}
 */
function cloneDefaultTodos() {
  return defaultTodos.map((todo) =>
    normalizeTodo({
      ...todo,
    }),
  );
}

/**
 * localStorageからTODO一覧を読み込みます。
 *
 * @returns {Array}
 */
function loadTodos() {
  const savedTodos = localStorage.getItem(TODOS_STORAGE_KEY);

  if (!savedTodos) {
    return cloneDefaultTodos();
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);

    if (!Array.isArray(parsedTodos)) {
      return cloneDefaultTodos();
    }

    return parsedTodos
      .filter((todo) => todo && typeof todo === "object")
      .map(normalizeTodo);
  } catch (error) {
    console.error("TODOデータの読み込みに失敗しました。", error);

    return cloneDefaultTodos();
  }
}

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: loadTodos(),
  }),

  getters: {
    /**
     * 現在ログイン中のユーザーのTODO一覧
     */
    currentUserTodos(state) {
      const userStore = useUserStore();

      const currentUserId = userStore.currentUser?.id;

      if (currentUserId === undefined || currentUserId === null) {
        return [];
      }

      return state.todos.filter(
        (todo) => Number(todo.userId) === Number(currentUserId),
      );
    },

    /**
     * 現在ログイン中のユーザーの期限ありTODO
     *
     * 期限が早い順に並べます。
     */
    currentUserDeadlineTodos() {
      return [...this.currentUserTodos]
        .filter((todo) => todo.hasDeadline)
        .sort((a, b) => {
          const aTime = new Date(a.deadlineAt).getTime();

          const bTime = new Date(b.deadlineAt).getTime();

          const aInvalid = Number.isNaN(aTime);

          const bInvalid = Number.isNaN(bTime);

          if (aInvalid && bInvalid) {
            return 0;
          }

          if (aInvalid) {
            return 1;
          }

          if (bInvalid) {
            return -1;
          }

          return aTime - bTime;
        });
    },

    /**
     * 現在ログイン中のユーザーの期限なしTODO
     *
     * 優先度が高い順に並べ、
     * 同じ優先度では新しい順に並べます。
     */
    currentUserNoDeadlineTodos() {
      const priorityOrder = {
        high: 3,
        medium: 2,
        low: 1,
      };

      return [...this.currentUserTodos]
        .filter((todo) => !todo.hasDeadline)
        .sort((a, b) => {
          const aPriority = priorityOrder[a.priority] ?? 2;

          const bPriority = priorityOrder[b.priority] ?? 2;

          if (aPriority !== bPriority) {
            return bPriority - aPriority;
          }

          const aCreatedAt = new Date(a.createdAt).getTime();

          const bCreatedAt = new Date(b.createdAt).getTime();

          return bCreatedAt - aCreatedAt;
        });
    },

    /**
     * 現在ログイン中のユーザーの達成済みTODO
     */
    currentUserCompletedTodos() {
      return [...this.currentUserTodos].filter(
        (todo) => Number(todo.progress) === 100,
      );
    },

    /**
     * IDを指定してTODOを取得します。
     */
    getTodoById: (state) => (todoId) => {
      const numericId = Number(todoId);

      return state.todos.find((todo) => Number(todo.id) === numericId) ?? null;
    },

    /**
     * ユーザーIDを指定してTODO一覧を取得します。
     */
    getTodosByUserId: (state) => (userId) => {
      const numericUserId = Number(userId);

      return state.todos.filter(
        (todo) => Number(todo.userId) === numericUserId,
      );
    },
  },

  actions: {
    /**
     * TODO一覧をlocalStorageへ保存します。
     */
    saveTodos() {
      localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(this.todos));
    },

    /**
     * 新しいTODOを追加します。
     *
     * @param {Object} todoData 入力データ
     * @returns {Object} 追加したTODO
     */
    addTodo(todoData) {
      const userStore = useUserStore();

      const currentUserId = userStore.currentUser?.id;

      if (currentUserId === undefined || currentUserId === null) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      const title =
        typeof todoData.title === "string" ? todoData.title.trim() : "";

      if (!title) {
        throw new Error("TODO名を入力してください。");
      }

      const hasDeadline = Boolean(todoData.hasDeadline);

      if (hasDeadline && !isValidDate(todoData.deadlineAt)) {
        throw new Error("正しい期限を設定してください。");
      }

      const repeatEnabled = hasDeadline && Boolean(todoData.repeatEnabled);

      let repeatType = null;

      if (repeatEnabled) {
        if (!isValidRepeatType(todoData.repeatType)) {
          throw new Error("繰り返し間隔を選択してください。");
        }

        repeatType = todoData.repeatType;
      }

      /*
       * 期限なしTODOだけ優先度を持ちます。
       */
      let priority = null;

      if (!hasDeadline) {
        priority = todoData.priority ?? "medium";

        if (!isValidPriority(priority)) {
          throw new Error("正しい優先度を選択してください。");
        }
      }

      const existingIds = this.todos
        .map((todo) => Number(todo.id))
        .filter((id) => !Number.isNaN(id));

      const nextId =
        existingIds.length === 0 ? 1 : Math.max(...existingIds) + 1;

      const now = new Date().toISOString();

      const newTodo = {
        id: nextId,

        userId: Number(currentUserId),

        title,

        hasDeadline,

        deadlineAt: hasDeadline
          ? new Date(todoData.deadlineAt).toISOString()
          : null,

        repeatEnabled,

        repeatType,

        priority,

        progress: normalizeProgress(todoData.progress ?? 0),

        createdAt: now,
        updatedAt: now,
      };

      this.todos.push(newTodo);

      this.saveTodos();

      return newTodo;
    },

    /**
     * TODOを更新します。
     *
     * @param {number} todoId TODO ID
     * @param {Object} updates 更新内容
     * @returns {boolean}
     */
    updateTodo(todoId, updates) {
      const numericId = Number(todoId);

      const todo = this.todos.find((item) => Number(item.id) === numericId);

      if (!todo) {
        return false;
      }

      if (Object.prototype.hasOwnProperty.call(updates, "title")) {
        const title =
          typeof updates.title === "string" ? updates.title.trim() : "";

        if (!title) {
          throw new Error("TODO名を入力してください。");
        }

        todo.title = title;
      }

      if (Object.prototype.hasOwnProperty.call(updates, "hasDeadline")) {
        todo.hasDeadline = Boolean(updates.hasDeadline);
      }

      if (Object.prototype.hasOwnProperty.call(updates, "deadlineAt")) {
        if (todo.hasDeadline && !isValidDate(updates.deadlineAt)) {
          throw new Error("正しい期限を設定してください。");
        }

        todo.deadlineAt = todo.hasDeadline
          ? new Date(updates.deadlineAt).toISOString()
          : null;
      }

      if (Object.prototype.hasOwnProperty.call(updates, "repeatEnabled")) {
        todo.repeatEnabled = todo.hasDeadline && Boolean(updates.repeatEnabled);
      }

      if (Object.prototype.hasOwnProperty.call(updates, "repeatType")) {
        if (todo.repeatEnabled) {
          if (!isValidRepeatType(updates.repeatType)) {
            throw new Error("繰り返し間隔を選択してください。");
          }

          todo.repeatType = updates.repeatType;
        } else {
          todo.repeatType = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(updates, "priority")) {
        if (!todo.hasDeadline) {
          const priority = updates.priority ?? "medium";

          if (!isValidPriority(priority)) {
            throw new Error("正しい優先度を選択してください。");
          }

          todo.priority = priority;
        }
      }

      if (Object.prototype.hasOwnProperty.call(updates, "progress")) {
        todo.progress = normalizeProgress(updates.progress);
      }

      /*
       * 期限ありTODOの場合、
       * 優先度は使用しません。
       */
      if (todo.hasDeadline) {
        todo.priority = null;

        if (!isValidDate(todo.deadlineAt)) {
          throw new Error("正しい期限を設定してください。");
        }
      }

      /*
       * 期限なしTODOの場合、
       * 期限と繰り返しを解除し、
       * 優先度を必ず設定します。
       */
      if (!todo.hasDeadline) {
        todo.deadlineAt = null;
        todo.repeatEnabled = false;
        todo.repeatType = null;

        if (!isValidPriority(todo.priority)) {
          todo.priority = "medium";
        }
      }

      if (!todo.repeatEnabled) {
        todo.repeatType = null;
      }

      todo.updatedAt = new Date().toISOString();

      this.saveTodos();

      return true;
    },

    /**
     * 達成率だけを更新します。
     */
    updateProgress(todoId, progress) {
      return this.updateTodo(todoId, {
        progress: normalizeProgress(progress),
      });
    },

    /**
     * TODOを1件削除します。
     */
    deleteTodo(todoId) {
      const numericId = Number(todoId);

      const index = this.todos.findIndex(
        (todo) => Number(todo.id) === numericId,
      );

      if (index === -1) {
        return false;
      }

      this.todos.splice(index, 1);

      this.saveTodos();

      return true;
    },

    /**
     * 現在ログイン中のユーザーの
     * 達成率100％のTODOを取得します。
     */
    getCompletedTodosForCurrentUser() {
      const userStore = useUserStore();

      const currentUserId = userStore.currentUser?.id;

      if (currentUserId === undefined || currentUserId === null) {
        return [];
      }

      return this.todos.filter(
        (todo) =>
          Number(todo.userId) === Number(currentUserId) &&
          Number(todo.progress) === 100,
      );
    },

    /**
     * 現在ログイン中のユーザーの
     * 達成率100％のTODOをまとめて削除します。
     */
    removeCompletedTodosForCurrentUser() {
      const userStore = useUserStore();

      const currentUserId = userStore.currentUser?.id;

      if (currentUserId === undefined || currentUserId === null) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      const completedTodos = this.todos.filter(
        (todo) =>
          Number(todo.userId) === Number(currentUserId) &&
          Number(todo.progress) === 100,
      );

      if (completedTodos.length === 0) {
        return {
          deletedCount: 0,
          deletedTodos: [],
        };
      }

      const completedTodoIds = new Set(
        completedTodos.map((todo) => Number(todo.id)),
      );

      this.todos = this.todos.filter(
        (todo) => !completedTodoIds.has(Number(todo.id)),
      );

      this.saveTodos();

      return {
        deletedCount: completedTodos.length,

        deletedTodos: completedTodos,
      };
    },

    /**
     * TODOを初期状態へ戻します。
     */
    resetTodos() {
      this.todos = cloneDefaultTodos();

      this.saveTodos();
    },
  },
});
