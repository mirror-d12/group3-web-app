<template>
  <v-text-field
    v-model="model"
    :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
    :type="show ? 'text' : 'password'"
    label="パスワード"
    variant="outlined"
    @click:append-inner="show = !show"
  />
</template>

<script setup>
import { ref } from "vue";

const model = defineModel();

const show = ref(false);
</script>
