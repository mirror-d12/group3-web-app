<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="dialog-overlay"
      role="presentation"
      @click.self="closeDialog"
    >
      <section
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-friend-title"
      >
        <button
          type="button"
          class="close-button"
          aria-label="ダイアログを閉じる"
          @click="closeDialog"
        >
          ×
        </button>

        <h2 id="add-friend-title" class="dialog-title">フレンド追加</h2>

        <div class="title-line"></div>

        <div class="dialog-content">
          <label for="friend-search" class="search-label">
            ユーザー名またはメールアドレス
          </label>

          <input
            id="friend-search"
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="ユーザーを検索"
            disabled
          />

          <p class="coming-message">
            ユーザー検索とフレンド申請は、次のコミットで実装します。
          </p>
        </div>

        <div class="dialog-actions">
          <button type="button" class="cancel-button" @click="closeDialog">
            閉じる
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const searchKeyword = ref("");

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      searchKeyword.value = "";
    }
  },
);

function closeDialog() {
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

  width: min(100%, 520px);

  padding: 30px;

  border-radius: 22px;

  background-color: #ffffff;

  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.25);

  box-sizing: border-box;
}

.close-button {
  position: absolute;
  top: 13px;
  right: 17px;

  width: 38px;
  height: 38px;

  padding: 0;

  border: none;
  border-radius: 50%;

  background-color: transparent;

  color: #444444;
  font-size: 30px;
  line-height: 1;

  cursor: pointer;
}

.close-button:hover {
  background-color: #eeeeee;
}

.dialog-title {
  margin: 0;

  color: #111111;
  font-size: 29px;
  font-weight: 800;
  text-align: center;
}

.title-line {
  width: 100%;
  height: 2px;

  margin: 15px 0 24px;

  background-color: #222222;
}

.dialog-content {
  width: 100%;
}

.search-label {
  display: block;

  margin-bottom: 8px;

  color: #222222;
  font-size: 16px;
  font-weight: 700;
}

.search-input {
  width: 100%;
  height: 50px;

  padding: 8px 13px;

  border: 2px solid #bdbdbd;
  border-radius: 10px;

  background-color: #f4f4f4;

  color: #555555;
  font-size: 16px;

  box-sizing: border-box;
}

.coming-message {
  margin: 17px 0 0;

  padding: 16px;

  border-radius: 10px;

  background-color: #e9fafd;

  color: #087f86;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
}

.dialog-actions {
  margin-top: 24px;

  display: flex;
  justify-content: center;
}

.cancel-button {
  min-width: 120px;
  height: 44px;

  border: none;
  border-radius: 22px;

  background-color: #eeeeee;

  color: #333333;
  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
}

.cancel-button:hover {
  background-color: #dddddd;
}

@media (max-width: 600px) {
  .dialog-overlay {
    padding: 14px;
  }

  .dialog {
    padding: 27px 18px 22px;
  }

  .dialog-title {
    font-size: 24px;
  }
}
</style>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="dialog-overlay"
      role="presentation"
      @click.self="closeDialog"
    >
      <section
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-friend-title"
      >
        <!-- 閉じるボタン -->
        <button
          type="button"
          class="close-button"
          aria-label="ダイアログを閉じる"
          @click="closeDialog"
        >
          ×
        </button>

        <!-- タイトル -->
        <h2 id="add-friend-title" class="dialog-title">フレンド追加</h2>

        <div class="title-line"></div>

        <div class="dialog-content">
          <!-- メールアドレス -->
          <label for="friend-email" class="search-label">
            メールアドレス
          </label>

          <div class="search-row">
            <input
              id="friend-email"
              v-model.trim="email"
              type="email"
              class="search-input"
              placeholder="example@mwu.jp"
              autocomplete="email"
              @keydown.enter.prevent="searchUser"
            />

            <button type="button" class="search-button" @click="searchUser">
              検索
            </button>
          </div>

          <!-- エラーメッセージ -->
          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <!-- 成功メッセージ -->
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>

          <!-- 検索結果 -->
          <div v-if="searchResult" class="search-result">
            <div class="user-information">
              <img
                :src="profileImageUrl(searchResult)"
                alt="プロフィール画像"
                class="profile-image"
              />

              <div class="user-text">
                <p class="user-name">
                  {{ searchResult.userName }}
                </p>

                <p class="user-email">
                  {{ searchResult.email }}
                </p>
              </div>
            </div>

            <!-- ボタン・状態表示 -->
            <div class="result-action">
              <span v-if="searchResult.isFriend" class="status-text friend">
                フレンド
              </span>

              <span
                v-else-if="searchResult.hasOutgoingRequest"
                class="status-text pending"
              >
                申請済み
              </span>

              <span
                v-else-if="searchResult.hasIncomingRequest"
                class="status-text received"
              >
                申請を受信済み
              </span>

              <button
                v-else
                type="button"
                class="request-button"
                @click="sendRequest"
              >
                申請する
              </button>
            </div>
          </div>

          <!-- 検索しても見つからなかった -->
          <p
            v-if="searched && !searchResult && !errorMessage"
            class="not-found-message"
          >
            該当するユーザーが見つかりませんでした。
          </p>
        </div>

        <!-- 下部ボタン -->
        <div class="dialog-actions">
          <button type="button" class="cancel-button" @click="closeDialog">
            閉じる
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
<script setup>
import { computed, ref, watch } from "vue";

import { useFriendStore } from "../../stores/friendStore";

/*
 * src/images内のプロフィール画像を読み込みます。
 */
const profileImages = import.meta.glob("../../images/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const friendStore = useFriendStore();

/**
 * 検索するメールアドレス
 */
const email = ref("");

/**
 * 検索結果
 */
const searchResult = ref(null);

/**
 * 検索済みかどうか
 */
const searched = ref(false);

/**
 * エラーメッセージ
 */
const errorMessage = ref("");

/**
 * 成功メッセージ
 */
const successMessage = ref("");

/**
 * ダイアログを閉じたら
 * 入力内容を初期化します。
 */
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      return;
    }

    email.value = "";

    searchResult.value = null;

    searched.value = false;

    errorMessage.value = "";

    successMessage.value = "";
  },
);

/**
 * プロフィール画像を取得します。
 */
function profileImageUrl(user) {
  if (!user) {
    return profileImages["../../images/profile1.png"] ?? "";
  }

  const fileName = user.profileImage;

  if (!fileName) {
    return profileImages["../../images/profile1.png"] ?? "";
  }

  return (
    profileImages[`../../images/${fileName}`] ??
    profileImages["../../images/profile1.png"]
  );
}
/**
 * メールアドレスでユーザーを検索します。
 */
function searchUser() {
  errorMessage.value = "";
  successMessage.value = "";
  searchResult.value = null;
  searched.value = true;

  const normalizedEmail = email.value.trim();

  if (!normalizedEmail) {
    errorMessage.value = "メールアドレスを入力してください。";
    return;
  }

  const result = friendStore.searchUserByEmail(normalizedEmail);

  if (!result) {
    return;
  }

  searchResult.value = result;
}

/**
 * フレンド申請を送信します。
 */
function sendRequest() {
  if (!searchResult.value) {
    return;
  }

  errorMessage.value = "";
  successMessage.value = "";

  try {
    friendStore.sendFriendRequest(searchResult.value.id);

    successMessage.value = `${searchResult.value.userName}さんへフレンド申請を送信しました。`;

    /*
     * 検索結果を「申請済み」に更新します。
     */
    searchResult.value = {
      ...searchResult.value,
      hasOutgoingRequest: true,
    };
  } catch (error) {
    console.error("フレンド申請エラー", error);

    errorMessage.value =
      error instanceof Error ? error.message : "フレンド申請に失敗しました。";
  }
}

/**
 * ダイアログを閉じる前に
 * 入力内容を初期化します。
 */
function resetDialog() {
  email.value = "";
  searchResult.value = null;
  searched.value = false;
  errorMessage.value = "";
  successMessage.value = "";
}

/*
 * closeDialog()を上書きします。
 */
function closeDialog() {
  resetDialog();

  emit("update:modelValue", false);
}
</script>
<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;

  background-color: rgba(0, 0, 0, 0.45);

  box-sizing: border-box;
}

.dialog {
  position: relative;

  width: min(100%, 560px);

  padding: 30px;

  border-radius: 20px;

  background-color: #ffffff;

  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);

  box-sizing: border-box;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 18px;

  width: 36px;
  height: 36px;

  border: none;
  border-radius: 50%;

  background: transparent;

  font-size: 30px;
  color: #555;

  cursor: pointer;
}

.close-button:hover {
  background: #eeeeee;
}

.dialog-title {
  margin: 0;

  text-align: center;

  font-size: 30px;
  font-weight: 800;
}

.title-line {
  width: 100%;
  height: 2px;

  margin: 15px 0 25px;

  background: #222;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-label {
  font-size: 17px;
  font-weight: 700;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-input {
  flex: 1;

  height: 48px;

  padding: 0 14px;

  border: 2px solid #cccccc;
  border-radius: 10px;

  font-size: 16px;

  box-sizing: border-box;
}

.search-input:focus {
  outline: none;

  border-color: #2563eb;
}

.search-button {
  width: 95px;
  height: 48px;

  border: none;
  border-radius: 12px;

  background-color: #2563eb;

  color: #ffffff;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.search-button:hover {
  background-color: #1d4ed8;
}

.search-button:active {
  transform: scale(0.97);
}

.error-message {
  color: #e40303;

  font-size: 15px;
  font-weight: 700;
}

.success-message {
  color: #12a91a;

  font-size: 15px;
  font-weight: 700;
}

.not-found-message {
  color: #666;

  text-align: center;

  font-size: 15px;
}

.search-result {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 18px;

  border: 2px solid #dddddd;
  border-radius: 14px;

  background: #fafafa;
}

.user-information {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-image {
  width: 60px;
  height: 60px;

  border-radius: 50%;

  object-fit: cover;

  border: 2px solid #dddddd;
}

.user-text {
  display: flex;
  flex-direction: column;
}

.user-name {
  margin: 0;

  font-size: 20px;
  font-weight: 700;
}

.user-email {
  margin: 5px 0 0;

  color: #777777;

  font-size: 14px;
}

.result-action {
  display: flex;
  align-items: center;
}

.request-button {
  padding: 10px 22px;

  border: none;
  border-radius: 10px;

  background: #ffaa00;

  color: white;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.request-button:hover {
  background: #e69900;
}

.status-text {
  font-size: 16px;
  font-weight: 700;
}

.status-text.friend {
  color: #12a91a;
}

.status-text.pending {
  color: #ffaa00;
}

.status-text.received {
  color: #00c3ce;
}

.dialog-actions {
  display: flex;
  justify-content: center;

  margin-top: 30px;
}

.cancel-button {
  width: 120px;
  height: 45px;

  border: none;
  border-radius: 999px;

  background: #e0e0e0;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
}

.cancel-button:hover {
  background: #d3d3d3;
}

@media (max-width: 600px) {
  .dialog {
    padding: 22px 18px;
  }

  .dialog-title {
    font-size: 24px;
  }

  .search-row {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
    height: 45px;
  }

  .search-result {
    flex-direction: column;
    gap: 18px;
    align-items: flex-start;
  }

  .result-action {
    width: 100%;
    justify-content: flex-end;
  }

  .request-button {
    width: 100%;
  }
}
</style>
