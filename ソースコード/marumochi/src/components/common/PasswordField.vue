<template>
  <v-text-field
    v-model="model"
    :label="label"
    :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
    :type="show ? 'text' : 'password'"
    variant="outlined"
    bg-color="white"
    hide-details
    @click:append-inner="show = !show"
  />
</template>

<script setup>
import { ref } from "vue";

const show = ref(false);
const model = defineModel();

defineProps({
  label: {
    type: String,
    default: "パスワード",
  },
});
</script>
