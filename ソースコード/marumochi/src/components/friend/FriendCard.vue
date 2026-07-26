<template>
  <article class="friend-card">
    <!-- プロフィール画像 -->
    <div class="profile-area">
      <img
        :src="profileImageUrl"
        :alt="`${displayName}のプロフィール画像`"
        class="profile-image"
        @error="useFallbackImage"
      />
    </div>

    <!-- フレンド情報 -->
    <div class="friend-information">
      <h2 class="friend-name">
        {{ displayName }}
      </h2>

      <p class="login-days">
        Login:
        <strong> {{ normalizedLoginDays }}day </strong>
      </p>
    </div>

    <!-- 通知共有・解除 -->
    <div class="friend-actions">
      <div class="notification-area">
        <p class="notification-label">通知共有</p>

        <FriendNotificationToggle
          :model-value="notificationEnabled"
          :aria-label="`${displayName}との通知共有`"
          @update:model-value="updateNotification"
        />
      </div>

      <button
        type="button"
        class="remove-button"
        :disabled="removing"
        :aria-label="`${displayName}をフレンド解除`"
        @click="requestRemove"
      >
        {{ removing ? "解除中..." : "フレンド解除" }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

import FriendNotificationToggle from "./FriendNotificationToggle.vue";

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

  removing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:notification-enabled", "remove"]);

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

/**
 * 親コンポーネントへ
 * フレンド解除を通知します。
 */
function requestRemove() {
  if (props.removing) {
    return;
  }

  emit("remove", props.friend.id);
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
  min-height: 138px;

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

.friend-actions {
  min-width: 120px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 11px;
}

.notification-area {
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

.remove-button {
  min-width: 112px;
  height: 34px;

  padding: 0 13px;

  border: 2px solid #e40303;
  border-radius: 17px;

  background-color: #ffffff;

  color: #e40303;
  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.remove-button:hover:not(:disabled) {
  background-color: #e40303;
  color: #ffffff;

  transform: translateY(-1px);
}

.remove-button:disabled {
  border-color: #aaaaaa;

  color: #888888;

  cursor: not-allowed;
  opacity: 0.7;
}

.remove-button:focus-visible {
  outline: 3px solid rgba(228, 3, 3, 0.22);

  outline-offset: 3px;
}

@media (max-width: 600px) {
  .friend-card {
    min-height: 120px;

    padding: 14px;

    grid-template-columns: 72px minmax(0, 1fr);

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

  .friend-actions {
    grid-column: 1 / -1;

    width: 100%;

    flex-direction: row;
    justify-content: flex-end;

    gap: 14px;
  }

  .notification-area {
    flex-direction: row;

    gap: 8px;
  }

  .notification-label {
    font-size: 12px;
  }

  .remove-button {
    min-width: 105px;
  }
}
</style>
