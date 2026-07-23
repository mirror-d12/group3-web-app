<template>
  <div class="progress-control">
    <div class="slider-area">
      <input
        class="progress-slider"
        type="range"
        min="0"
        max="100"
        step="1"
        :value="normalizedProgress"
        :style="sliderStyle"
        :aria-label="ariaLabel"
        :disabled="!editable"
        @input="changeProgress"
      />
    </div>

    <span class="progress-value"> {{ normalizedProgress }}% </span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },

  editable: {
    type: Boolean,
    default: false,
  },

  ariaLabel: {
    type: String,
    default: "TODOの達成率",
  },
});

const emit = defineEmits(["update:progress"]);

const normalizedProgress = computed(() => {
  const value = Number(props.progress);

  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
});

const sliderStyle = computed(() => ({
  background: `
    linear-gradient(
      to right,
      #ffaa00 0%,
      #ffaa00 ${normalizedProgress.value}%,
      #bdbdbd ${normalizedProgress.value}%,
      #bdbdbd 100%
    )
  `,
}));

function changeProgress(event) {
  if (!props.editable) {
    return;
  }

  emit("update:progress", Number(event.target.value));
}
</script>

<style scoped>
.progress-control {
  width: 100%;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 54px;
  align-items: center;

  gap: 12px;
}

.slider-area {
  width: 100%;
  height: 32px;

  display: flex;
  align-items: center;
}

.progress-slider {
  width: 100%;
  height: 20px;

  margin: 0;

  border: none;
  border-radius: 10px;

  appearance: none;
  -webkit-appearance: none;

  cursor: pointer;
  outline: none;
}

.progress-slider:disabled {
  cursor: default;
}

.progress-slider:focus-visible {
  outline: 3px solid rgba(255, 170, 0, 0.35);
  outline-offset: 4px;
}

/* Chrome・Edge・Safari */
.progress-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 20px;

  border-radius: 10px;

  background: transparent;
}

.progress-slider::-webkit-slider-thumb {
  width: 24px;
  height: 24px;

  margin-top: -2px;

  border: 3px solid #ffffff;
  border-radius: 50%;

  appearance: none;
  -webkit-appearance: none;

  background-color: #ffaa00;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);

  cursor: grab;
}

.progress-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
}

/* Firefox */
.progress-slider::-moz-range-track {
  width: 100%;
  height: 20px;

  border: none;
  border-radius: 10px;

  background: transparent;
}

.progress-slider::-moz-range-progress {
  height: 20px;

  border-radius: 10px;

  background-color: transparent;
}

.progress-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;

  border: 3px solid #ffffff;
  border-radius: 50%;

  background-color: #ffaa00;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);

  cursor: grab;
}

.progress-value {
  min-width: 50px;

  padding: 0;

  border: none;
  background: transparent;

  color: #000000;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  text-align: right;

  box-sizing: border-box;
}

@media (max-width: 600px) {
  .progress-control {
    grid-template-columns: minmax(0, 1fr) 46px;

    gap: 8px;
  }

  .progress-value {
    min-width: 46px;

    font-size: 16px;
  }

  .progress-slider::-webkit-slider-thumb {
    width: 22px;
    height: 22px;

    margin-top: -1px;
  }

  .progress-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
  }
}
</style>
