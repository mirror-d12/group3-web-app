<template>
  <form class="todo-form" @submit.prevent="submitForm">
    <h2 class="form-title">
      {{ mode === "add" ? "TODOを追加" : "TODOを編集" }}
    </h2>

    <!-- TODO名 -->
    <div class="form-group">
      <label :for="titleInputId" class="form-label"> TODO名 </label>

      <input
        :id="titleInputId"
        v-model="title"
        type="text"
        class="form-input"
        maxlength="100"
        placeholder="TODOを入力してください"
      />
    </div>

    <!-- 期限ありTODO -->
    <template v-if="hasDeadline">
      <!-- 期限 -->
      <div class="form-group">
        <label :for="deadlineInputId" class="form-label"> 期限 </label>

        <input
          :id="deadlineInputId"
          v-model="deadline"
          type="datetime-local"
          class="form-input"
        />

        <p v-if="formattedDeadlinePreview" class="deadline-preview">
          設定される期限：
          <strong>
            {{ formattedDeadlinePreview }}
          </strong>
        </p>
      </div>

      <!-- 繰り返し -->
      <div class="form-group">
        <div class="repeat-header">
          <span class="form-label repeat-label"> 繰り返し </span>

          <div class="repeat-toggle" role="group" aria-label="繰り返し設定">
            <button
              type="button"
              class="repeat-toggle__button"
              :class="{
                'repeat-toggle__button--active': !repeatEnabled,
              }"
              :aria-pressed="!repeatEnabled"
              @click="turnRepeatOff"
            >
              OFF
            </button>

            <button
              type="button"
              class="repeat-toggle__button"
              :class="{
                'repeat-toggle__button--active': repeatEnabled,
              }"
              :aria-pressed="repeatEnabled"
              @click="turnRepeatOn"
            >
              ON
            </button>
          </div>
        </div>
      </div>

      <!-- 繰り返しONの場合のみ -->
      <div v-if="repeatEnabled" class="form-group">
        <label :for="repeatInputId" class="form-label"> 繰り返し間隔 </label>

        <select
          :id="repeatInputId"
          v-model="repeatType"
          class="form-input form-select"
        >
          <option value="daily">毎日</option>

          <option value="weekly">毎週</option>

          <option value="monthly">毎月</option>
        </select>
      </div>
    </template>

    <!-- 期限なしTODO -->
    <template v-else>
      <div class="form-group">
        <label :for="priorityInputId" class="form-label"> 優先度 </label>

        <select
          :id="priorityInputId"
          v-model="priority"
          class="form-input form-select"
        >
          <option value="high">高</option>

          <option value="medium">中</option>

          <option value="low">低</option>
        </select>

        <p class="priority-help">
          期限なしTODOは、優先度が高い順に表示されます。
        </p>
      </div>
    </template>

    <!-- エラー -->
    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <!-- 操作ボタン -->
    <div class="form-actions">
      <button
        type="button"
        class="action-button cancel-button"
        @click="cancelForm"
      >
        キャンセル
      </button>

      <button type="submit" class="action-button submit-button">
        {{ mode === "add" ? "追加" : "保存" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  mode: {
    type: String,
    default: "add",
    validator(value) {
      return ["add", "edit"].includes(value);
    },
  },

  hasDeadline: {
    type: Boolean,
    default: false,
  },

  initialTodo: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const title = ref("");
const deadline = ref("");

const repeatEnabled = ref(false);
const repeatType = ref("daily");

const priority = ref("medium");

const errorMessage = ref("");

const titleInputId = computed(() => `todo-title-${props.mode}`);

const deadlineInputId = computed(() => `todo-deadline-${props.mode}`);

const repeatInputId = computed(() => `todo-repeat-${props.mode}`);

const priorityInputId = computed(() => `todo-priority-${props.mode}`);

/**
 * ISO形式をdatetime-local用の形式へ変換します。
 */
function toDateTimeLocalValue(isoDate) {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset();

  const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

/**
 * 追加時の初期期限を現在日時の1日後にします。
 */
function createDefaultDeadline() {
  const date = new Date();

  date.setDate(date.getDate() + 1);

  return toDateTimeLocalValue(date.toISOString());
}

/**
 * フォームを初期化します。
 */
function resetForm() {
  title.value = props.initialTodo?.title ?? "";

  if (props.hasDeadline) {
    deadline.value = props.initialTodo?.deadlineAt
      ? toDateTimeLocalValue(props.initialTodo.deadlineAt)
      : createDefaultDeadline();
  } else {
    deadline.value = "";
  }

  repeatEnabled.value =
    props.hasDeadline && Boolean(props.initialTodo?.repeatEnabled);

  const initialRepeatType = props.initialTodo?.repeatType;

  repeatType.value = ["daily", "weekly", "monthly"].includes(initialRepeatType)
    ? initialRepeatType
    : "daily";

  const initialPriority = props.initialTodo?.priority;

  priority.value = ["high", "medium", "low"].includes(initialPriority)
    ? initialPriority
    : "medium";

  errorMessage.value = "";
}

watch([() => props.initialTodo, () => props.hasDeadline], resetForm, {
  immediate: true,
  deep: true,
});

const formattedDeadlinePreview = computed(() => {
  if (!props.hasDeadline || !deadline.value) {
    return "";
  }

  const date = new Date(deadline.value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  const hour = String(date.getHours()).padStart(2, "0");

  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}年/${month}月/` + `${day}日 ${hour}:${minute}`;
});

function turnRepeatOff() {
  repeatEnabled.value = false;
}

function turnRepeatOn() {
  repeatEnabled.value = true;

  if (!["daily", "weekly", "monthly"].includes(repeatType.value)) {
    repeatType.value = "daily";
  }
}

function submitForm() {
  const trimmedTitle = title.value.trim();

  if (!trimmedTitle) {
    errorMessage.value = "TODO名を入力してください。";
    return;
  }

  let deadlineAt = null;

  if (props.hasDeadline) {
    if (!deadline.value) {
      errorMessage.value = "期限を設定してください。";
      return;
    }

    const deadlineDate = new Date(deadline.value);

    if (Number.isNaN(deadlineDate.getTime())) {
      errorMessage.value = "正しい期限を設定してください。";
      return;
    }

    deadlineAt = deadlineDate.toISOString();

    if (
      repeatEnabled.value &&
      !["daily", "weekly", "monthly"].includes(repeatType.value)
    ) {
      errorMessage.value = "繰り返し間隔を選択してください。";
      return;
    }
  }

  if (
    !props.hasDeadline &&
    !["high", "medium", "low"].includes(priority.value)
  ) {
    errorMessage.value = "優先度を選択してください。";
    return;
  }

  const todoData = {
    title: trimmedTitle,

    hasDeadline: props.hasDeadline,

    deadlineAt,

    repeatEnabled: props.hasDeadline ? repeatEnabled.value : false,

    repeatType:
      props.hasDeadline && repeatEnabled.value ? repeatType.value : null,

    priority: props.hasDeadline ? null : priority.value,
  };

  if (props.mode === "add") {
    todoData.progress = 0;
  }

  errorMessage.value = "";

  emit("submit", todoData);
}

function cancelForm() {
  resetForm();
  emit("cancel");
}
</script>

<style scoped>
.todo-form {
  width: 100%;

  padding: 28px;

  background-color: #ffffff;
  border: 3px solid #75cfe8;
  border-radius: 18px;

  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.12);

  box-sizing: border-box;
}

.form-title {
  margin: 0 0 24px;

  color: #222222;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
}

.form-group {
  margin-bottom: 21px;
}

.form-label {
  display: block;

  margin-bottom: 9px;

  color: #111111;
  font-size: 19px;
  font-weight: 700;
}

.form-input {
  width: 100%;
  height: 50px;

  padding: 8px 12px;

  border: 2px solid #75cfe8;
  border-radius: 9px;

  background-color: #ffffff;

  color: #222222;
  font-size: 17px;

  box-sizing: border-box;
}

.form-input:focus {
  border-color: #1597e5;
  outline: none;

  box-shadow: 0 0 0 3px rgba(21, 151, 229, 0.2);
}

.form-select {
  cursor: pointer;
}

.deadline-preview {
  margin: 10px 0 0;

  color: #333333;
  font-size: 15px;
}

.deadline-preview strong {
  color: #e40303;
  font-weight: 700;
}

.repeat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 16px;
}

.repeat-label {
  margin-bottom: 0;
}

.repeat-toggle {
  width: 170px;
  height: 44px;

  padding: 4px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);

  background-color: #e8e8e8;
  border-radius: 24px;

  box-sizing: border-box;
}

.repeat-toggle__button {
  border: none;
  border-radius: 20px;

  background-color: transparent;

  color: #555555;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.repeat-toggle__button--active {
  background-color: #12a91a;
  color: #ffffff;

  box-shadow: 0 2px 5px rgba(18, 169, 26, 0.35);
}

.priority-help {
  margin: 9px 0 0;

  color: #666666;
  font-size: 14px;
  line-height: 1.5;
}

.error-message {
  margin: 0 0 14px;

  color: #d32f2f;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}

.form-actions {
  margin-top: 12px;

  display: flex;
  justify-content: flex-end;

  gap: 12px;
}

.action-button {
  min-width: 105px;
  height: 44px;

  border: none;
  border-radius: 22px;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
}

.cancel-button {
  background-color: #eeeeee;
  color: #333333;
}

.submit-button {
  background-color: #ffaa00;
  color: #ffffff;
}

.submit-button:hover {
  background-color: #ee9e00;
}

@media (max-width: 600px) {
  .todo-form {
    padding: 22px 16px;
  }

  .form-title {
    font-size: 23px;
  }

  .form-label {
    font-size: 17px;
  }

  .form-input {
    font-size: 16px;
  }

  .repeat-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .repeat-toggle {
    width: 100%;
  }

  .form-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .action-button {
    width: 100%;
    min-width: 0;
  }
}
</style>
