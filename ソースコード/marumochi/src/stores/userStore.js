import { defineStore } from "pinia";
import { defaultUsers } from "../data/users";

const USERS_STORAGE_KEY = "todo-manager-users";
const CURRENT_USER_STORAGE_KEY = "todo-manager-current-user";

function loadUsers() {
  const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (savedUsers) {
    try {
      return JSON.parse(savedUsers);
    } catch (error) {
      console.error("ユーザーデータの読み込みに失敗しました。", error);
    }
  }

  return structuredClone(defaultUsers);
}

function loadCurrentUser(users) {
  const savedUserId = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

  if (!savedUserId) {
    return null;
  }

  const userId = Number(savedUserId);

  return users.find((user) => user.id === userId) ?? null;
}

export const useUserStore = defineStore("user", {
  state: () => {
    const users = loadUsers();

    return {
      users,
      currentUser: loadCurrentUser(users),
    };
  },

  getters: {
    isLoggedIn: (state) => state.currentUser !== null,
  },

  actions: {
    saveUsers() {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    },

    login(email, password, keepLogin = false) {
      const normalizedEmail = email.trim().toLowerCase();

      const user = this.users.find(
        (item) =>
          item.email.toLowerCase() === normalizedEmail &&
          item.password === password,
      );

      if (!user) {
        return false;
      }

      this.users.forEach((item) => {
        item.isLoggedIn = item.id === user.id;
      });

      this.currentUser = user;
      this.saveUsers();

      if (keepLogin) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, String(user.id));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }

      return true;
    },

    logout() {
      if (this.currentUser) {
        const user = this.users.find((item) => item.id === this.currentUser.id);

        if (user) {
          user.isLoggedIn = false;
        }
      }

      this.currentUser = null;

      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);

      this.saveUsers();
    },

    register(userName, email, password) {
      const normalizedEmail = email.trim().toLowerCase();

      const emailPattern = /^[A-Za-z0-9._%+-]+@mwu\.jp$/;

      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (!emailPattern.test(normalizedEmail)) {
        return {
          success: false,
          message: "メールアドレスは@mwu.jpの形式で入力してください。",
        };
      }

      if (!passwordPattern.test(password)) {
        return {
          success: false,
          message:
            "パスワードは半角英数字8文字以上で、小文字・大文字・数字をそれぞれ1文字以上含めてください。",
        };
      }

      const exists = this.users.some(
        (user) => user.email.toLowerCase() === normalizedEmail,
      );

      if (exists) {
        return {
          success: false,
          message: "このメールアドレスは既に登録されています。",
        };
      }

      const nextId =
        this.users.length === 0
          ? 1
          : Math.max(...this.users.map((user) => user.id)) + 1;

      this.users.push({
        id: nextId,
        userName: userName.trim(),
        email: normalizedEmail,
        password,
        friendIds: [],
        friendCount: 0,
        loginDays: 0,
        totalTodoCount: 0,
        createdAt: new Date().toISOString(),
        isLoggedIn: false,
        profileImage: "profile1.png",
        notificationEnabled: true,
        lastHomeVisitDate: null,
      });

      this.saveUsers();

      return {
        success: true,
        message: "",
      };
    },

    findUserByEmail(email) {
      const normalizedEmail = email.trim().toLowerCase();

      return (
        this.users.find(
          (user) => user.email.toLowerCase() === normalizedEmail,
        ) ?? null
      );
    },

    changePassword(email, newPassword) {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (!passwordPattern.test(newPassword)) {
        return {
          success: false,
          message:
            "パスワードは半角英数字8文字以上で、小文字・大文字・数字をそれぞれ1文字以上含めてください。",
        };
      }

      const user = this.findUserByEmail(email);

      if (!user) {
        return {
          success: false,
          message: "ユーザーが見つかりませんでした。",
        };
      }

      user.password = newPassword;

      this.saveUsers();

      return {
        success: true,
        message: "",
      };
    },
  },
});
