<template>
  <v-btn
    :color="color"
    :block="block"
    :disabled="disabled"
    @click="$emit('click')"
  >
    {{ text }}
  </v-btn>
</template>

<script setup>
defineProps({
  text: String,

  color: {
    type: String,
    default: "primary",
  },

  block: {
    type: Boolean,
    default: true,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>
