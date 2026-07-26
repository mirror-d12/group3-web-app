<template>
  <article class="sent-request-card">
    <img
      :src="profileImageUrl"
      :alt="`${receiverName}のプロフィール画像`"
      class="profile-image"
      @error="useFallbackImage"
    />

    <div class="receiver-information">
      <h3 class="receiver-name">
        {{ receiverName }}
      </h3>

      <p class="receiver-email">
        {{ receiverEmail }}
      </p>

      <p class="request-message">フレンド申請を送信済みです</p>
    </div>

    <div class="request-status">
      <span class="status-label"> 申請中 </span>
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
});

const receiverName = computed(() => {
  return (
    props.request.receiver?.userName ??
    props.request.receiver?.name ??
    "ユーザー"
  );
});

const receiverEmail = computed(() => {
  return props.request.receiver?.email ?? "";
});

const fallbackImageUrl = computed(() => {
  return profileImages["../../images/profile1.png"] ?? "";
});

const profileImageUrl = computed(() => {
  const fileName = props.request.receiver?.profileImage;

  if (!fileName) {
    return fallbackImageUrl.value;
  }

  return profileImages[`../../images/${fileName}`] ?? fallbackImageUrl.value;
});

function useFallbackImage(event) {
  if (fallbackImageUrl.value && event.target.src !== fallbackImageUrl.value) {
    event.target.src = fallbackImageUrl.value;
  }
}
</script>

<style scoped>
.sent-request-card {
  width: 100%;
  min-height: 112px;

  padding: 16px 20px;

  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  align-items: center;

  gap: 17px;

  border: 2px solid #cddcff;
  border-radius: 18px;

  background-color: #f5f8ff;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07);

  box-sizing: border-box;
}

.profile-image {
  width: 70px;
  height: 70px;

  border: 3px solid #ffffff;
  border-radius: 50%;

  background-color: #eeeeee;

  object-fit: cover;

  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.14);

  box-sizing: border-box;
}

.receiver-information {
  min-width: 0;
}

.receiver-name {
  margin: 0;

  color: #111111;
  font-size: 21px;
  font-weight: 800;

  overflow-wrap: anywhere;
}

.receiver-email {
  margin: 4px 0 0;

  color: #666666;
  font-size: 14px;

  overflow-wrap: anywhere;
}

.request-message {
  margin: 8px 0 0;

  color: #2563eb;
  font-size: 14px;
  font-weight: 700;
}

.request-status {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-label {
  min-width: 76px;

  padding: 8px 14px;

  border-radius: 18px;

  background-color: #2563eb;

  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  text-align: center;

  box-sizing: border-box;
}

@media (max-width: 600px) {
  .sent-request-card {
    padding: 14px;

    grid-template-columns: 60px minmax(0, 1fr);

    gap: 12px;
  }

  .profile-image {
    width: 58px;
    height: 58px;
  }

  .receiver-name {
    font-size: 18px;
  }

  .receiver-email,
  .request-message {
    font-size: 13px;
  }

  .request-status {
    grid-column: 1 / -1;

    justify-content: flex-end;
  }
}
</style>
