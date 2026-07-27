<template>
  <section class="profile-card">
    <!-- ユーザー名 -->
    <div class="name-area">
      <h2 class="user-name">
        {{ displayName }}
      </h2>

      <button
        type="button"
        class="edit-name-button"
        aria-label="ユーザー名を編集"
        @click="editName"
      >
        <img :src="nameSettingIcon" alt="" class="edit-name-icon" />
      </button>
    </div>

    <div class="profile-line"></div>

    <!-- プロフィール画像 -->
    <div class="avatar-area">
      <div class="avatar-wrapper">
        <!-- 画像自体にはクリック処理を設定しない -->
        <div class="profile-image-background">
          <img
            :src="profileImageUrl"
            :alt="`${displayName}のプロフィール画像`"
            class="profile-image"
            @error="useFallbackImage"
          />
        </div>

        <!-- 歯車ボタン -->
        <button
          type="button"
          class="image-setting-button"
          :aria-label="`${displayName}のプロフィール画像を変更`"
          @click="editAvatar"
        >
          <img :src="imageSettingIcon" alt="" class="image-setting-icon" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import nameSettingIcon from "../../images/name_setting.png";
import imageSettingIcon from "../../images/image_settings.png";

const profileImages = import.meta.glob("../../images/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["edit-name", "edit-avatar"]);

const displayName = computed(() => {
  return props.user.userName ?? props.user.name ?? "ユーザー";
});

const fallbackImageUrl = computed(() => {
  return profileImages["../../images/profile1.png"] ?? "";
});

const profileImageUrl = computed(() => {
  const fileName = props.user.profileImage;

  if (!fileName) {
    return fallbackImageUrl.value;
  }

  return profileImages[`../../images/${fileName}`] ?? fallbackImageUrl.value;
});

function editName() {
  emit("edit-name");
}

function editAvatar() {
  emit("edit-avatar");
}

function useFallbackImage(event) {
  if (fallbackImageUrl.value && event.target.src !== fallbackImageUrl.value) {
    event.target.src = fallbackImageUrl.value;
  }
}
</script>

<style scoped>
.profile-card {
  width: 100%;
}

.name-area {
  min-height: 80px;

  padding: 0 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 14px;
}

.user-name {
  min-width: 0;

  margin: 0;

  color: #111111;
  font-size: 32px;
  font-weight: 800;

  overflow-wrap: anywhere;
}

.edit-name-button {
  width: 54px;
  height: 54px;

  padding: 7px;

  flex-shrink: 0;

  border: none;
  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: transparent;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.edit-name-button:hover {
  background-color: #eeeeee;

  transform: translateY(-1px);
}

.edit-name-icon {
  width: 39px;
  height: 39px;

  display: block;

  object-fit: contain;
}

.profile-line {
  width: 100%;
  height: 2px;

  background-color: #111111;
}

.avatar-area {
  width: 100%;

  padding: 30px 0 24px;

  display: flex;
  justify-content: center;
}

.avatar-wrapper {
  position: relative;

  width: 350px;
  height: 350px;
}

.profile-image-background {
  width: 100%;
  height: 100%;

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #dddddd;

  overflow: hidden;
}

.profile-image {
  width: 92%;
  height: 92%;

  display: block;

  border-radius: 50%;

  object-fit: cover;
}

/*
 * プロフィール画像変更用の歯車ボタン
 */
.image-setting-button {
  position: absolute;
  top: -24px;
  right: -170px;

  width: 92px;
  height: 92px;

  padding: 8px;

  border: none;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: transparent;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.image-setting-button:hover {
  background-color: rgba(238, 238, 238, 0.85);

  transform: rotate(15deg);
}

.image-setting-icon {
  width: 66px;
  height: 66px;

  display: block;

  object-fit: contain;
}

.edit-name-button:focus-visible,
.image-setting-button:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.35);

  outline-offset: 4px;
}

@media (max-width: 600px) {
  .name-area {
    padding: 0 5px;
  }

  .user-name {
    font-size: 26px;
  }

  .edit-name-button {
    width: 48px;
    height: 48px;

    padding: 6px;
  }

  .edit-name-icon {
    width: 35px;
    height: 35px;
  }

  .avatar-wrapper {
    width: 280px;
    height: 280px;
  }

  .image-setting-button {
    top: -19px;
    right: -13px;

    width: 68px;
    height: 68px;
  }

  .image-setting-icon {
    width: 55px;
    height: 55px;
  }
}
</style>
