<template>
  <v-text-field
    v-model="model"
    :label="label"
    :type="show ? 'text' : 'password'"
    variant="outlined"
    bg-color="white"
    hide-details
  >
    <!-- 右側のアイコン部分をカスタム画像に置き換え -->
    <template #append-inner>
      <img
        :src="show ? showIcon : hideIcon"
        alt="パスワード表示切り替え"
        class="eye-icon"
        @click="show = !show"
      />
    </template>
  </v-text-field>
</template>

<script setup>
import { ref } from "vue";

// src/images/ から画像をインポート
import hideIcon from "@/images/password_hide.png";
import showIcon from "@/images/password_show.png";

const show = ref(false);
const model = defineModel();

defineProps({
  label: {
    type: String,
    default: "パスワード",
  },
});
</script>

<style scoped>
.eye-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  object-fit: contain;
}
</style>
