<template>
  <section class="countdown">
    <p class="countdown-label">今日が終わるまで</p>

    <p class="countdown-value">
      {{ formattedRemainingTime }}
    </p>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const remainingMilliseconds = ref(0);

let timerId = null;

/**
 * 翌日の0時までの残り時間を計算します。
 */
function updateRemainingTime() {
  const now = new Date();

  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);

  remainingMilliseconds.value = Math.max(0, tomorrow.getTime() - now.getTime());
}

/**
 * HH:MM:SS形式へ変換します。
 */
const formattedRemainingTime = computed(() => {
  const totalSeconds = Math.floor(remainingMilliseconds.value / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
});

onMounted(() => {
  updateRemainingTime();

  timerId = window.setInterval(updateRemainingTime, 1000);
});

onBeforeUnmount(() => {
  if (timerId !== null) {
    window.clearInterval(timerId);
  }
});
</script>

<style scoped>
.countdown {
  width: 100%;

  text-align: center;

  pointer-events: none;
}

.countdown-label {
  margin: 0;

  color: #000000;

  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;

  text-shadow: 2px 2px 5px rgba(255, 255, 255, 0.95);
}

.countdown-value {
  margin: 8px 0 0;

  color: #00c3ce;

  font-size: 82px;

  font-weight: 900;
  letter-spacing: 7px;
  line-height: 1;

  text-shadow: 3px 3px 8px rgba(255, 255, 255, 0.95);
}

@media (max-width: 600px) {
  .countdown-label {
    font-size: 24px;
  }

  .countdown-value {
    margin-top: 6px;

    font-size: 58px;
    letter-spacing: 4px;
  }
}
</style>
