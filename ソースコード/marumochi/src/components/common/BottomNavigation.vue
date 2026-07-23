<template>
  <footer class="bottom-navigation">
    <!-- 猫耳 -->
    <span class="cat-ear cat-ear--left"></span>
    <span class="cat-ear cat-ear--right"></span>

    <!-- ナビゲーション -->
    <nav class="navigation-menu" aria-label="メインナビゲーション">
      <button
        v-for="item in navigationItems"
        :key="item.path"
        type="button"
        class="navigation-button"
        :class="{
          'navigation-button--active': route.path === item.path,
          'navigation-button--home': item.path === '/home',
        }"
        :aria-label="`${item.label}画面へ移動`"
        :aria-current="route.path === item.path ? 'page' : undefined"
        @click="move(item.path)"
      >
        <span class="icon-area">
          <img :src="item.image" :alt="item.label" class="navigation-icon" />
        </span>

        <span class="navigation-label">
          {{ item.label }}
        </span>
      </button>
    </nav>
  </footer>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

import profileIcon from "../../images/footer_profile.png";
import friendIcon from "../../images/footer_friend.png";
import homeIcon from "../../images/footer_home.png";
import todoIcon from "../../images/footer_todo.png";
import formIcon from "../../images/footer_form.png";

const router = useRouter();
const route = useRoute();

const navigationItems = [
  {
    label: "マイページ",
    path: "/mypage",
    image: profileIcon,
  },
  {
    label: "フレンド",
    path: "/friend",
    image: friendIcon,
  },
  {
    label: "ホーム",
    path: "/home",
    image: homeIcon,
  },
  {
    label: "TODO",
    path: "/todo",
    image: todoIcon,
  },
  {
    label: "お問い合わせ",
    path: "/contact",
    image: formIcon,
  },
];

function move(path) {
  if (route.path === path) {
    return;
  }

  router.push(path);
}
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;

  width: 100%;
  height: 92px;

  background-color: #d9d9d9;
  border-top: 2px solid #9e9e9e;
  border-radius: 24px 24px 0 0;

  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);

  z-index: 1000;
}

/* 猫耳共通 */
.cat-ear {
  position: absolute;
  top: -27px;

  width: 55px;
  height: 55px;

  background-color: #d9d9d9;
  border-top: 2px solid #9e9e9e;
  border-left: 2px solid #9e9e9e;

  transform: rotate(45deg);

  z-index: -1;
}

/* 左耳 */
.cat-ear--left {
  left: 18%;
}

/* 右耳 */
.cat-ear--right {
  right: 18%;
}

/*
 * 耳の下半分をフッター本体で隠し、
 * 三角形のように見せます。
 */
.bottom-navigation::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;

  height: 34px;

  background-color: #d9d9d9;
  border-radius: 24px 24px 0 0;

  content: "";

  z-index: 0;
}

.navigation-menu {
  position: relative;
  z-index: 1;

  width: 100%;
  height: 100%;

  padding: 8px 8px 5px;

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: end;

  box-sizing: border-box;
}

.navigation-button {
  min-width: 0;
  height: 68px;

  padding: 0 2px;

  border: none;
  outline: none;
  background-color: transparent;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  color: #424242;

  cursor: pointer;
  opacity: 0.7;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.navigation-button:hover,
.navigation-button:focus-visible {
  opacity: 1;
}

.navigation-button--active {
  opacity: 1;
  transform: translateY(-3px);
}

/* ホームを中央で少し強調 */
.navigation-button--home {
  transform: translateY(-4px);
}

.navigation-button--home.navigation-button--active {
  transform: translateY(-7px);
}

.icon-area {
  width: 58px;
  height: 52px;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 2px;
}

.navigation-icon {
  max-width: 50px;
  max-height: 50px;

  width: auto;
  height: auto;

  object-fit: contain;
}

.navigation-label {
  width: 100%;
  min-height: 16px;

  margin-top: 4px;

  overflow: hidden;

  color: #333333;
  font-size: 10px;
  font-weight: bold;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media (max-width: 600px) {
  .bottom-navigation {
    height: 84px;
    border-radius: 20px 20px 0 0;
  }

  .cat-ear {
    top: -22px;

    width: 45px;
    height: 45px;
  }

  .cat-ear--left {
    left: 15%;
  }

  .cat-ear--right {
    right: 15%;
  }

  .navigation-menu {
    padding: 6px 3px calc(4px + env(safe-area-inset-bottom));
  }

  .navigation-button {
    height: 61px;
  }

  .icon-area {
    width: 38px;
    height: 32px;
  }

  .navigation-icon {
    max-width: 32px;
    max-height: 30px;
  }

  .navigation-button--home .icon-area {
    width: 43px;
    height: 38px;
  }

  .navigation-button--home .navigation-icon {
    max-width: 35px;
    max-height: 35px;
  }

  .navigation-label {
    font-size: 8px;
  }
}
</style>
