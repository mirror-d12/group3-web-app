<template>
  <section class="streak-card">
    <img :src="streakIcon" alt="" class="streak-icon" />

    <div class="streak-content">
      <p class="streak-label">連続ログイン</p>

      <p class="streak-value">{{ loginDays }}日</p>
    </div>
  </section>
</template>

<script setup>
import streakIcon from '../../images/loginday_count.png';

defineProps({
  loginDays: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.streak-card {
  min-width: 180px;
  min-height: 84px;

  padding: 12px 18px;

  display: flex;
  align-items: center;

  gap: 14px;

  background-color: #fff4dc;
  border: 2px solid #ffaa00;
  border-radius: 20px;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  box-sizing: border-box;
}

.streak-icon {
  width: 48px;
  height: 48px;

  object-fit: contain;
}

.streak-content {
  display: flex;
  flex-direction: column;

  gap: 2px;
}

.streak-label {
  margin: 0;

  color: #5c4300;
  font-size: 14px;
  font-weight: 700;
}

.streak-value {
  margin: 0;

  color: #e56a00;
  font-size: 27px;
  font-weight: 800;
}

@media (max-width: 600px) {
  .streak-card {
    min-width: 0;

    padding: 10px 14px;
  }

  .streak-icon {
    width: 42px;
    height: 42px;
  }

  .streak-value {
    font-size: 24px;
  }
}
</style>
