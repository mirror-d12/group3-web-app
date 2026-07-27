<template>
  <div class="avatar-grid">
    <button
      v-for="avatar in avatars"
      :key="avatar"
      type="button"
      class="avatar-item"
      :class="{
        'avatar-item--selected': modelValue === avatar,
      }"
      :aria-label="`${avatar}を選択`"
      :aria-pressed="modelValue === avatar"
      @click="selectAvatar(avatar)"
    >
      <img :src="getAvatarUrl(avatar)" alt="" class="avatar-image" />

      <span
        v-if="modelValue === avatar"
        class="selected-mark"
        aria-hidden="true"
      >
        ✓
      </span>
    </button>
  </div>
</template>

<script setup>
const profileImages = import.meta.glob("../../images/*", {
  eager: true,
  query: "?url",
  import: "default",
});

defineProps({
  modelValue: {
    type: String,
    default: "",
  },

  avatars: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

function getAvatarUrl(fileName) {
  return (
    profileImages[`../../images/${fileName}`] ??
    profileImages["../../images/profile1.png"] ??
    ""
  );
}

function selectAvatar(avatar) {
  emit("update:modelValue", avatar);
}
</script>

<style scoped>
.avatar-grid {
  width: 100%;

  display: grid;

  /*
   * 横3列×縦2行
   */
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 26px;
}

.avatar-item {
  position: relative;

  width: 100%;
  aspect-ratio: 1;

  padding: 8px;

  border: 4px solid transparent;
  border-radius: 50%;

  background-color: #eeeeee;

  cursor: pointer;

  overflow: visible;

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  box-sizing: border-box;
}

.avatar-item:hover {
  transform: translateY(-3px);

  box-shadow: 0 7px 15px rgba(0, 0, 0, 0.15);
}

.avatar-item--selected {
  border-color: #2563eb;

  background-color: #eaf0ff;

  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.16);
}

.avatar-image {
  width: 100%;
  height: 100%;

  display: block;

  border-radius: 50%;

  object-fit: cover;
}

.selected-mark {
  position: absolute;
  right: 2px;
  bottom: 2px;

  width: 38px;
  height: 38px;

  border: 4px solid #ffffff;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #2563eb;

  color: #ffffff;
  font-size: 21px;
  font-weight: 800;

  box-sizing: border-box;
}

.avatar-item:focus-visible {
  outline: 4px solid rgba(37, 99, 235, 0.3);

  outline-offset: 4px;
}

@media (max-width: 600px) {
  .avatar-grid {
    gap: 15px;
  }

  .avatar-item {
    padding: 5px;

    border-width: 3px;
  }

  .selected-mark {
    width: 31px;
    height: 31px;

    border-width: 3px;

    font-size: 17px;
  }
}
</style>
