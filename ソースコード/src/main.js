/*プログラム全体を動かすための司令塔 */
/*
「プログラムの開始」：webブラウザやサーバー（Node.jsなど）がこのファイルを最初に読み込み、実行する
「他のファイルのまとめ役」：機能ごとにファイルを分割したものを正しく連動させる
「初期設定」：アプリが起動した直後に一度だけで実行したい設定（データの初期化、画面の最初の描画など）をここに記述する
*/

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

/*このアプリでVue Routerを使います！とVueに教えるためのコード*/
app.use(router); //←app.use()：便利な機能（プラグイン）をアプリに追加する

/*
各コンポーネントでは、
 import{useRouter} from "vue-router";
 const router = useRouter();
と書くだけで、ルーターを利用できる
 */

/*ルーターを何度も登録する必要がないように、アプリの起動時に一度だけVueへ登録し、その後はどのコンポーネントからでも利用できるようにしてい */

/*Vueアプリをブラウザに”表示する”処理 */
app.mount("#app");
