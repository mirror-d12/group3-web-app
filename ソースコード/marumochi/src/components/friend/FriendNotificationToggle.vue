<template>
  <button
    type="button"
    class="notification-toggle"
    :class="{
      'notification-toggle--enabled': modelValue,
      'notification-toggle--disabled': !modelValue,
    }"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="ariaLabel"
    @click="toggleNotification"
  >
    <span class="toggle-knob" aria-hidden="true"></span>

    <span class="toggle-text">
      {{ modelValue ? "ON" : "OFF" }}
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  ariaLabel: {
    type: String,
    default: "通知共有",
  },
});

const emit = defineEmits(["update:modelValue"]);

function toggleNotification() {
  emit("update:modelValue", !props.modelValue);
}
</script>

<style scoped>
.notification-toggle {
  position: relative;

  width: 76px;
  height: 38px;

  padding: 0;

  border: none;
  border-radius: 20px;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  box-sizing: border-box;
}

.notification-toggle--enabled {
  background-color: #00c3ce;

  box-shadow: 0 2px 7px rgba(0, 195, 206, 0.35);
}

.notification-toggle--disabled {
  background-color: #bdbdbd;
}

.toggle-knob {
  position: absolute;
  top: 4px;
  left: 4px;

  width: 30px;
  height: 30px;

  border-radius: 50%;

  background-color: #ffffff;

  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);

  transition: transform 0.2s ease;
}

.notification-toggle--enabled .toggle-knob {
  transform: translateX(38px);
}

.toggle-text {
  position: absolute;
  top: 50%;

  color: #ffffff;
  font-size: 11px;
  font-weight: 800;

  transform: translateY(-50%);

  pointer-events: none;
}

.notification-toggle--enabled .toggle-text {
  left: 11px;
}

.notification-toggle--disabled .toggle-text {
  right: 8px;
}

.notification-toggle:focus-visible {
  outline: 3px solid rgba(0, 195, 206, 0.3);

  outline-offset: 3px;
}

@media (max-width: 600px) {
  .notification-toggle {
    width: 66px;
    height: 34px;
  }

  .toggle-knob {
    width: 26px;
    height: 26px;
  }

  .notification-toggle--enabled .toggle-knob {
    transform: translateX(32px);
  }

  .toggle-text {
    font-size: 10px;
  }

  .notification-toggle--enabled .toggle-text {
    left: 9px;
  }

  .notification-toggle--disabled .toggle-text {
    right: 7px;
  }
}
</style>
