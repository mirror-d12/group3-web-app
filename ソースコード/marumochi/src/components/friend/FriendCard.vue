<template>
  <article class="friend-card">
    <div class="profile-area">
      <img
        :src="profileImageUrl"
        :alt="`${displayName}のプロフィール画像`"
        class="profile-image"
        @error="useFallbackImage"
      />
    </div>

    <div class="friend-information">
      <h2 class="friend-name">
        {{ displayName }}
      </h2>

      <p class="login-days">
        Login:
        <strong> {{ normalizedLoginDays }}day </strong>
      </p>
    </div>

    <div class="notification-area">
      <p class="notification-label">通知共有</p>

      <FriendNotificationToggle
        :model-value="notificationEnabled"
        :aria-label="`${displayName}との通知共有`"
        @update:model-value="updateNotification"
      />
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

import FriendNotificationToggle from "./FriendNotificationToggle.vue";

/*
 * src/images内の画像を読み込みます。
 */
const profileImages = import.meta.glob("../../images/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const props = defineProps({
  friend: {
    type: Object,
    required: true,
  },

  notificationEnabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:notification-enabled"]);

const displayName = computed(() => {
  return props.friend.userName ?? props.friend.name ?? "ユーザー";
});

const normalizedLoginDays = computed(() => {
  const value = Number(props.friend.loginDays);

  if (Number.isNaN(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
});

const fallbackImageUrl = computed(() => {
  return profileImages["../../images/profile1.png"] ?? "";
});

const profileImageUrl = computed(() => {
  const fileName = props.friend.profileImage;

  if (!fileName) {
    return fallbackImageUrl.value;
  }

  return profileImages[`../../images/${fileName}`] ?? fallbackImageUrl.value;
});

function updateNotification(enabled) {
  emit("update:notification-enabled", Boolean(enabled));
}

function useFallbackImage(event) {
  if (fallbackImageUrl.value && event.target.src !== fallbackImageUrl.value) {
    event.target.src = fallbackImageUrl.value;
  }
}
</script>

<style scoped>
.friend-card {
  width: 100%;
  min-height: 126px;

  padding: 18px 24px;

  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) auto;
  align-items: center;

  gap: 20px;

  border: 2px solid #d2d2d2;
  border-radius: 20px;

  background-color: #ffffff;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  box-sizing: border-box;
}

.profile-area {
  width: 88px;
  height: 88px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-image {
  width: 88px;
  height: 88px;

  border: 3px solid #eeeeee;
  border-radius: 50%;

  background-color: #f7f7f7;

  object-fit: cover;

  box-sizing: border-box;
}

.friend-information {
  min-width: 0;
}

.friend-name {
  margin: 0 0 9px;

  color: #111111;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.3;

  overflow-wrap: anywhere;
}

.login-days {
  margin: 0;

  color: #555555;
  font-size: 17px;
}

.login-days strong {
  color: #00aeb8;
  font-size: 19px;
  font-weight: 800;
}

.notification-area {
  min-width: 96px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 7px;
}

.notification-label {
  margin: 0;

  color: #555555;
  font-size: 13px;
  font-weight: 700;
}

@media (max-width: 600px) {
  .friend-card {
    min-height: 108px;

    padding: 14px;

    grid-template-columns: 72px minmax(0, 1fr) auto;

    gap: 12px;
  }

  .profile-area,
  .profile-image {
    width: 70px;
    height: 70px;
  }

  .friend-name {
    margin-bottom: 6px;

    font-size: 20px;
  }

  .login-days {
    font-size: 14px;
  }

  .login-days strong {
    font-size: 16px;
  }

  .notification-area {
    min-width: 72px;
  }

  .notification-label {
    font-size: 11px;
  }
}
</style>
