<template>
  <v-text-field
    v-model="model"
    :label="label"
    variant="outlined"
    hide-details
  />
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
});

const model = defineModel();
</script>

<style scoped>
/* Vuetifyの入力エリア内部を強制的に白にする */
:deep(.v-field) {
  background-color: #ffffff !important;
}
</style>
