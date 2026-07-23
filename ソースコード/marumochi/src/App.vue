<template>
  <v-app>
    <v-main
      :class="[
        'app-main',
        {
          'app-main--with-footer': route.meta.showFooter,
        },
      ]"
    >
      <router-view />
    </v-main>

    <BottomNavigation v-if="route.meta.showFooter" />
  </v-app>
</template>

<script setup>
import { useRoute } from "vue-router";

import BottomNavigation from "./components/common/BottomNavigation.vue";

const route = useRoute();
</script>

<style>
html,
body,
#app {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}

.app-main {
  min-height: 100vh;
}
</style>
