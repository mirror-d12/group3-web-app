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
      localStorage.setItem("todo-manager-users", JSON.stringify(this.users));
    },

    saveCurrentUser() {
      localStorage.setItem(
        "todo-manager-current-user",
        JSON.stringify(this.currentUser),
      );
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
    /**
     * 現在ログイン中のユーザー名を変更します。
     */
    updateCurrentUserName(userName) {
      const trimmedName = String(userName ?? "").trim();

      if (!trimmedName) {
        throw new Error("ユーザー名を入力してください。");
      }

      if (trimmedName.length > 30) {
        throw new Error("ユーザー名は30文字以内で入力してください。");
      }

      if (!this.currentUser) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      const user = this.users.find(
        (item) => Number(item.id) === Number(this.currentUser.id),
      );

      if (!user) {
        throw new Error("ユーザー情報が見つかりません。");
      }

      user.userName = trimmedName;

      this.currentUser = {
        ...this.currentUser,
        userName: trimmedName,
      };

      this.saveUsers();
      this.saveCurrentUser();

      return user;
    },

    /**
     * 現在ログイン中のプロフィール画像を変更します。
     */
    updateCurrentUserAvatar(profileImage) {
      const validAvatars = [
        "profile1.png",
        "profile2.png",
        "profile3.png",
        "profile4.png",
        "profile5.png",
        "profile6.png",
        "profile7.png",
        "profile8.png",
      ];

      if (!validAvatars.includes(profileImage)) {
        throw new Error("正しいプロフィール画像を選択してください。");
      }

      if (!this.currentUser) {
        throw new Error("ログイン中のユーザーが見つかりません。");
      }

      const user = this.users.find(
        (item) => Number(item.id) === Number(this.currentUser.id),
      );

      if (!user) {
        throw new Error("ユーザー情報が見つかりません。");
      }

      user.profileImage = profileImage;

      this.currentUser = {
        ...this.currentUser,
        profileImage,
      };

      this.saveUsers();
      this.saveCurrentUser();

      return user;
    },
  },
});
