import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import PasswordResetView from "../views/PasswordResetView.vue";
import NewPasswordView from "../views/NewPasswordView.vue";

import HomeView from "../views/HomeView.vue";
import TodoView from "../views/TodoView.vue";
import FriendView from "../views/FriendView.vue";
import MyPageView from "../views/MyPageView.vue";
import ContactView from "../views/ContactView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      showFooter: false,
    },
  },

  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: {
      showFooter: false,
    },
  },

  {
    path: "/password-reset",
    name: "PasswordReset",
    component: PasswordResetView,
    meta: {
      showFooter: false,
    },
  },

  {
    path: "/new-password",
    name: "NewPassword",
    component: NewPasswordView,
    meta: {
      showFooter: false,
    },
  },

  {
    path: "/home",
    name: "Home",
    component: HomeView,
    meta: {
      showFooter: true,
    },
  },

  {
    path: "/todo",
    name: "Todo",
    component: TodoView,
    meta: {
      showFooter: true,
    },
  },

  {
    path: "/friend",
    name: "Friend",
    component: FriendView,
    meta: {
      showFooter: true,
    },
  },

  {
    path: "/mypage",
    name: "MyPage",
    component: MyPageView,
    meta: {
      showFooter: true,
    },
  },

  {
    path: "/contact",
    name: "Contact",
    component: ContactView,
    meta: {
      showFooter: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
