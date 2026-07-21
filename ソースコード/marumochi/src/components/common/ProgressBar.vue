<template>
  <div>
    <v-progress-linear
      :model-value="progress"
      height="18"
      color="green"
      rounded
    >
      <strong>{{ progress }}%</strong>
    </v-progress-linear>
  </div>
</template>

<script setup>
defineProps({
  progress: {
    type: Number,

    default: 0,
  },
});
</script>
