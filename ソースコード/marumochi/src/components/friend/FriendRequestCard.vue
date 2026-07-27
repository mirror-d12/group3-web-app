<template>
  <article class="request-card">
    <img
      :src="profileImageUrl"
      :alt="`${senderName}のプロフィール画像`"
      class="profile-image"
      @error="useFallbackImage"
    />

    <div class="sender-information">
      <h3 class="sender-name">
        {{ senderName }}
      </h3>

      <p class="sender-email">
        {{ senderEmail }}
      </p>

      <p class="request-message">フレンド申請が届いています</p>
    </div>

    <div class="request-actions">
      <button
        type="button"
        class="action-button reject-button"
        :disabled="processing"
        @click="rejectRequest"
      >
        拒否
      </button>

      <button
        type="button"
        class="action-button accept-button"
        :disabled="processing"
        @click="acceptRequest"
      >
        {{ processing ? "処理中..." : "承認" }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const profileImages = import.meta.glob("../../images/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const props = defineProps({
  request: {
    type: Object,
    required: true,
  },

  processing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["accept", "reject"]);

const senderName = computed(() => {
  return (
    props.request.sender?.userName ?? props.request.sender?.name ?? "ユーザー"
  );
});

const senderEmail = computed(() => {
  return props.request.sender?.email ?? "";
});

const fallbackImageUrl = computed(() => {
  return profileImages["../../images/profile1.png"] ?? "";
});

const profileImageUrl = computed(() => {
  const fileName = props.request.sender?.profileImage;

  if (!fileName) {
    return fallbackImageUrl.value;
  }

  return profileImages[`../../images/${fileName}`] ?? fallbackImageUrl.value;
});

function acceptRequest() {
  emit("accept", props.request.id);
}

function rejectRequest() {
  emit("reject", props.request.id);
}

function useFallbackImage(event) {
  if (fallbackImageUrl.value && event.target.src !== fallbackImageUrl.value) {
    event.target.src = fallbackImageUrl.value;
  }
}
</script>

<style scoped>
.request-card {
  width: 100%;
  min-height: 120px;

  padding: 17px 20px;

  display: grid;
  grid-template-columns: 76px minmax(0, 1fr) auto;
  align-items: center;

  gap: 17px;

  border: 2px solid #bceaf0;
  border-radius: 18px;

  background-color: #f2fdff;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07);

  box-sizing: border-box;
}

.profile-image {
  width: 74px;
  height: 74px;

  border: 3px solid #ffffff;
  border-radius: 50%;

  background-color: #eeeeee;

  object-fit: cover;

  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.14);

  box-sizing: border-box;
}

.sender-information {
  min-width: 0;
}

.sender-name {
  margin: 0;

  color: #111111;
  font-size: 21px;
  font-weight: 800;

  overflow-wrap: anywhere;
}

.sender-email {
  margin: 4px 0 0;

  color: #666666;
  font-size: 14px;

  overflow-wrap: anywhere;
}

.request-message {
  margin: 8px 0 0;

  color: #008d96;
  font-size: 14px;
  font-weight: 700;
}

.request-actions {
  display: flex;
  align-items: center;

  gap: 8px;
}

.action-button {
  min-width: 74px;
  height: 38px;

  padding: 0 14px;

  border: none;
  border-radius: 19px;

  color: #ffffff;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.accept-button {
  background-color: #2563eb;
}

.accept-button:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.reject-button {
  background-color: #777777;
}

.reject-button:hover:not(:disabled) {
  background-color: #555555;
}

@media (max-width: 600px) {
  .request-card {
    padding: 14px;

    grid-template-columns: 62px minmax(0, 1fr);

    gap: 12px;
  }

  .profile-image {
    width: 60px;
    height: 60px;
  }

  .sender-name {
    font-size: 18px;
  }

  .sender-email,
  .request-message {
    font-size: 13px;
  }

  .request-actions {
    grid-column: 1 / -1;

    justify-content: flex-end;
  }

  .action-button {
    flex: 1;
  }
}
</style>
