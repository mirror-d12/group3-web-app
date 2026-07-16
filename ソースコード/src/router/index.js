/*URLと表示する画面（コンポーネント）の対応表を作るファイル */

import { createRouter, createWebHistory } from "vue-router";
/*createRouter：ルーター（画面切り替え機能を作る関数）どの画面を表示するかをRouterが判断する */
/*createWebHistory：ブラウザのURLを普通のWebサイトのようにする機能（使わないと、https://example.com/#/loginのように、#がつく） */

import LoginView from "../views/LoginView.vue";
/*「ログイン画面」を使えるようにしている。 */

import ChatView from "@/components/ChatView.vue";

import TopView from "@/views/TopView.vue";
/*@：srcフォルダを表す特別な記号 */

//↓ルーターの設定を作り始めている
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), //← URLをどう管理するか
  //※ import.meta.env.BASE_URL：viteが自動で用意してくれるこのサイトのの開始位置で、普通は「/」になる

  routes: [
    //← URLと画面の対応表
    {
      path: "/", //← どのURLで表示するか（この場合：トップページで表示）
      name: "login", //← この画面につける名前で、名前で画面を切り替えることができる（router.push({name:"login"})）
      //※router.push()：画面を移動したいときにscript setupの中で使用する、function.login(){}の中とか
      component: LoginView, //← このURLになったらどの画面んを表示するかを指定している。
    },
    {
      path: "/top",
      name: "top",
      component: TopView,
    },
    {
      path: "/chats/:id",
      name: "chat",
      component: ChatView,
    },
  ],
});

/*このファイルで作成した「router」を他のファイルでも使えるようにしている */
export default router;
