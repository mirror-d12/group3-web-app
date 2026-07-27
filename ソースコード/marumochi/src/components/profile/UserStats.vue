<template>
  <section class="user-stats" aria-label="ユーザー統計">
    <!-- フレンド数 -->
    <article class="stat-note stat-note--friends">
      <div class="stat-content">
        <span class="stat-label"> Friends： </span>

        <div class="stat-value-area">
          <strong class="stat-value">
            {{ normalizedFriendCount }}
          </strong>

          <span class="stat-unit"> 人 </span>
        </div>
      </div>

      <div class="stat-color-band" aria-hidden="true"></div>
    </article>

    <!-- 連続ログイン日数 -->
    <article class="stat-note stat-note--login">
      <div class="stat-content">
        <span class="stat-label"> Login： </span>

        <div class="stat-value-area">
          <strong class="stat-value">
            {{ normalizedLoginDays }}
          </strong>

          <span class="stat-unit"> 日 </span>
        </div>
      </div>

      <div class="stat-color-band" aria-hidden="true"></div>
    </article>

    <!-- 達成したTODO -->
    <article class="stat-note stat-note--achieved">
      <div class="stat-content">
        <span class="stat-label"> Achieved TODO： </span>

        <div class="stat-value-area">
          <strong class="stat-value achieved-value">
            {{ normalizedTotalTodoCount }}
          </strong>

          <span class="stat-unit"> 回 </span>
        </div>
      </div>

      <div class="stat-color-band" aria-hidden="true"></div>
    </article>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  friendCount: {
    type: Number,
    default: 0,
  },

  loginDays: {
    type: Number,
    default: 0,
  },

  totalTodoCount: {
    type: Number,
    default: 0,
  },
});

/**
 * 値を0以上の整数へ変換します。
 */
function normalizeCount(value) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || numberValue < 0) {
    return 0;
  }

  return Math.floor(numberValue);
}

const normalizedFriendCount = computed(() => {
  return normalizeCount(props.friendCount);
});

const normalizedLoginDays = computed(() => {
  return normalizeCount(props.loginDays);
});

const normalizedTotalTodoCount = computed(() => {
  return normalizeCount(props.totalTodoCount);
});
</script>

<style scoped>
.user-stats {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 18px;
}

.stat-note {
  position: relative;

  width: 100%;
  min-height: 88px;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 54px;

  overflow: hidden;

  border-radius: 3px;

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.22);

  box-sizing: border-box;
}

/*
 * 付箋上部の光沢感
 */
.stat-note::before {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  width: calc(100% - 54px);
  height: 5px;

  background-color: rgba(255, 255, 255, 0.55);

  content: "";
}

.stat-content {
  min-width: 0;

  padding: 16px 22px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 16px;

  box-sizing: border-box;
}

.stat-label {
  min-width: 0;

  color: #111111;
  font-size: 27px;
  font-weight: 800;
  line-height: 1.3;

  overflow-wrap: anywhere;
}

.stat-value-area {
  flex-shrink: 0;

  display: flex;
  justify-content: flex-end;
  align-items: baseline;

  gap: 9px;
}

.stat-value {
  color: #111111;
  font-size: 46px;
  font-weight: 800;
  line-height: 1;
}

.stat-unit {
  color: #111111;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.stat-color-band {
  width: 100%;
  height: 100%;
}

/* Friends */
.stat-note--friends {
  background-color: #fff5ff;
}

.stat-note--friends .stat-color-band {
  background-color: #f2a8f5;
}

/* Login */
.stat-note--login {
  background-color: #eaf8ff;
}

.stat-note--login .stat-color-band {
  background-color: #19c3ec;
}

/* Achieved TODO */
.stat-note--achieved {
  background-color: #ffffe5;
}

.stat-note--achieved .stat-color-band {
  background-color: #ffff00;
}

.achieved-value {
  color: #e40303;
}

@media (max-width: 600px) {
  .user-stats {
    gap: 14px;
  }

  .stat-note {
    min-height: 76px;

    grid-template-columns: minmax(0, 1fr) 42px;
  }

  .stat-note::before {
    width: calc(100% - 42px);
  }

  .stat-content {
    padding: 13px 14px;

    gap: 8px;
  }

  .stat-label {
    font-size: 20px;
  }

  .stat-value-area {
    gap: 6px;
  }

  .stat-value {
    font-size: 36px;
  }

  .stat-unit {
    font-size: 19px;
  }
}

@media (max-width: 390px) {
  .stat-note {
    min-height: 102px;
  }

  .stat-content {
    align-items: flex-start;
    flex-direction: column;

    gap: 5px;
  }

  .stat-value-area {
    width: 100%;

    justify-content: flex-end;
  }
}
</style>
