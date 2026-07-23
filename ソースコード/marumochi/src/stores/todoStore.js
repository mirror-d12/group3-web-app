import { defineStore } from "pinia";

import { defaultTodos } from "../data/todos";
import { useUserStore } from "./userStore";

const TODOS_STORAGE_KEY = "todo-manager-todos";

/**
 * 初期TODOデータを複製します。
 * defaultTodosを直接変更しないための処理です。
 */
function cloneDefaultTodos() {
  return defaultTodos.map((todo) => ({
    ...todo,
  }));
}

/**
 * localStorageからTODOを読み込みます。
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

    return parsedTodos;
  } catch (error) {
    console.error("TODOデータの読み込みに失敗しました。", error);

    return cloneDefaultTodos();
  }
}

/**
 * 達成率を0〜100の範囲に収めます。
 */
function normalizeProgress(progress) {
  const numericProgress = Number(progress);

  if (Number.isNaN(numericProgress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, numericProgress));
}

/**
 * 日時として正しい値か確認します。
 */
function isValidDate(dateValue) {
  if (!dateValue) {
    return false;
  }

  const date = new Date(dateValue);

  return !Number.isNaN(date.getTime());
}

/**
 * 許可する繰り返し間隔か確認します。
 */
function isValidRepeatType(repeatType) {
  return ["daily", "weekly", "monthly"].includes(repeatType);
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
     * 期限ありTODO
     *
     * 期限が近い順に並べます。
     * 日時が不正なTODOは最後へ送ります。
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
     * 期限なしTODO
     *
     * 新しく作成された順に並べます。
     */
    currentUserNoDeadlineTodos() {
      return [...this.currentUserTodos]
        .filter((todo) => !todo.hasDeadline)
        .sort((a, b) => {
          const aTime = new Date(a.createdAt).getTime();

          const bTime = new Date(b.createdAt).getTime();

          return bTime - aTime;
        });
    },

    /**
     * IDでTODOを取得します。
     */
    getTodoById: (state) => (todoId) => {
      const numericId = Number(todoId);

      return state.todos.find((todo) => Number(todo.id) === numericId) ?? null;
    },

    /**
     * 指定ユーザーのTODOを取得します。
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

      const nextId =
        this.todos.length === 0
          ? 1
          : Math.max(...this.todos.map((todo) => Number(todo.id))) + 1;

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

      if (Object.prototype.hasOwnProperty.call(updates, "progress")) {
        todo.progress = normalizeProgress(updates.progress);
      }

      /*
       * 期限なしTODOでは、
       * 期限と繰り返し設定を解除します。
       */
      if (!todo.hasDeadline) {
        todo.deadlineAt = null;
        todo.repeatEnabled = false;
        todo.repeatType = null;
      }

      /*
       * 繰り返しOFFでは、
       * 繰り返し間隔を解除します。
       */
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
     * TODOを削除します。
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
     * TODOを初期状態へ戻します。
     * 開発・動作確認用です。
     */
    resetTodos() {
      this.todos = cloneDefaultTodos();

      this.saveTodos();
    },
  },
});
