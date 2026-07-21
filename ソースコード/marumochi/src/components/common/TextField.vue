<template>
  <v-text-field
    v-model="model"
    :label="label"
    variant="outlined"
    hide-details
  />
</template>

<script setup>
const model = defineModel();

defineProps({
  label: String,
});
</script>
