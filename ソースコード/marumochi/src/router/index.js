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
    component: LoginView,
  },
  {
    path: "/register",
    component: RegisterView,
  },
  {
    path: "/password-reset",
    name: "PasswordReset",
    component: PasswordResetView,
  },
  {
    path: "/new-password",
    name: "NewPassword",
    component: NewPasswordView,
  },
  {
    path: "/home",
    component: HomeView,
  },
  {
    path: "/todo",
    component: TodoView,
  },
  {
    path: "/friend",
    component: FriendView,
  },
  {
    path: "/mypage",
    component: MyPageView,
  },
  {
    path: "/contact",
    component: ContactView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
