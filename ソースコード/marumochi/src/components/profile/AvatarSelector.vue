<template>
  <Teleport to="body">
    <div v-if="modelValue" class="dialog-overlay" @click.self="closeSelector">
      <section
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-selector-title"
      >
        <button
          type="button"
          class="close-button"
          aria-label="閉じる"
          @click="closeSelector"
        >
          ×
        </button>

        <h2 id="avatar-selector-title" class="dialog-title">
          プロフィール画像を選択
        </h2>

        <AvatarGrid v-model="selectedAvatar" :avatars="avatars" />

        <div class="dialog-actions">
          <button type="button" class="cancel-button" @click="closeSelector">
            キャンセル
          </button>

          <button type="button" class="save-button" @click="saveAvatar">
            保存
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";

import AvatarGrid from "./AvatarGrid.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  currentAvatar: {
    type: String,
    default: "profile1.png",
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

/*
 * 横3列×縦2行にするため、
 * 選択肢を6枚にします。
 */
const avatars = [
  "profile1.png",
  "profile2.png",
  "profile3.png",
  "profile4.png",
  "profile5.png",
  "profile6.png",
];

const selectedAvatar = ref("profile1.png");

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      return;
    }

    selectedAvatar.value = avatars.includes(props.currentAvatar)
      ? props.currentAvatar
      : "profile1.png";
  },
);

function saveAvatar() {
  emit("save", selectedAvatar.value);
}

function closeSelector() {
  emit("update:modelValue", false);
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;

  padding: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.45);

  box-sizing: border-box;
}

.dialog {
  position: relative;

  width: min(100%, 720px);
  max-height: 92vh;

  padding: 36px;

  border-radius: 24px;

  background-color: #ffffff;

  overflow-y: auto;

  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);

  box-sizing: border-box;
}

.close-button {
  position: absolute;
  top: 14px;
  right: 18px;

  width: 42px;
  height: 42px;

  padding: 0;

  border: none;
  border-radius: 50%;

  background-color: transparent;

  color: #555555;
  font-size: 32px;

  cursor: pointer;
}

.close-button:hover {
  background-color: #eeeeee;
}

.dialog-title {
  margin: 0 0 32px;

  color: #111111;
  font-size: 30px;
  font-weight: 800;
  text-align: center;
}

.dialog-actions {
  margin-top: 32px;

  display: flex;
  justify-content: flex-end;

  gap: 14px;
}

.cancel-button,
.save-button {
  min-width: 120px;
  height: 48px;

  border: none;
  border-radius: 24px;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;
}

.cancel-button {
  background-color: #eeeeee;
  color: #333333;
}

.cancel-button:hover {
  background-color: #dddddd;
}

.save-button {
  background-color: #2563eb;
  color: #ffffff;
}

.save-button:hover {
  background-color: #1d4ed8;
}

@media (max-width: 600px) {
  .dialog-overlay {
    padding: 12px;
  }

  .dialog {
    width: 100%;

    padding: 32px 18px 24px;
  }

  .dialog-title {
    font-size: 24px;
  }

  .dialog-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .cancel-button,
  .save-button {
    width: 100%;
    min-width: 0;
  }
}
</style>
