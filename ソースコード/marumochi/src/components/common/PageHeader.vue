<template>
  <div class="header">
    <h2>{{ title }}</h2>

    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: String,
});
</script>

<style scoped>
.header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 20px;
}
</style>
