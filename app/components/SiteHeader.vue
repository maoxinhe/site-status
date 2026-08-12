<script setup lang="ts">
const { t } = useI18n();
const statusStore = useStatusStore();

// 倒计时
const updateTime = ref(300);

// 站点状态文本
const siteGlobalText = computed(() => ({
  loading: t("site.loading"),
  unknown: t("site.unknown"),
  normal: t("site.normal"),
  error: t("site.error"),
  warn: t("site.warn"),
}));

// 更新倒计时
const nextUpdateTime = computed(() => {
  const time = updateTime.value;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return minutes > 0
    ? `${minutes} ${t("meta.minute")} ${seconds} ${t("meta.second")}`
    : `${seconds} ${t("meta.second")}`;
});

// 更新数据
const refresh = async () => {
  const lastUpdate = statusStore.siteData?.timestamp || 0;
  if (!lastUpdate) return;
  // 小于 5 分钟
  if (Date.now() - lastUpdate < 5 * 60 * 1000) return;
  statusStore.siteStatus = "loading";
  await getSiteData();
};

// 倒计时
const { pause: pauseTime, resume: resumeTime } = useIntervalFn(
  () => {
    if (updateTime.value > 0) updateTime.value--;
    if (updateTime.value === 0) {
      pauseTime();
      statusStore.siteStatus = "loading";
      getSiteData().then(() => {
        updateTime.value = 300;
        resumeTime();
      });
    }
  },
  1000,
  { immediate: true },
);
</script>

<template>
  <header>
    <!-- 状态封面背景 -->
    <div class="status-cover" :class="`cover-${statusStore.siteStatus}`"></div>

    <!-- 内容区 -->
    <div class="status-content">
      <div class="site-status">
        <div class="status-text">
          <!-- 状态圆点 -->
          <div class="point" :class="`point-${statusStore.siteStatus}`">
            <span class="pulse-ring"></span>
          </div>

          <!-- 文字 -->
          <div class="text">
            <div class="title font-cheese">
              {{ siteGlobalText[statusStore.siteStatus] }}
            </div>
            <div class="tip">
              <span v-if="statusStore.siteStatus === 'loading'">
                {{ $t("header.loading") }}
              </span>
              <span v-else-if="statusStore.siteStatus === 'unknown'">
                {{ $t("header.unknown") }}
              </span>
              <span v-else>
                {{ $t("header.update") }}
                {{
                  formatTime(statusStore.siteData?.timestamp || 0, {
                    showTime: true,
                    showOnlyTimeIfToday: true,
                  })
                }}
              </span>
              <NButton
                text
                size="tiny"
                @click="refresh"
                class="refresh-btn"
              >
                🔄
              </NButton>
              <span>{{ $t("header.updateAt", { time: nextUpdateTime }) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 波浪 -->
    <div class="waves-area" aria-hidden="true">
      <svg
        class="parallax"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" />
          <use xlink:href="#gentle-wave" x="48" y="3" />
          <use xlink:href="#gentle-wave" x="48" y="5" />
          <use xlink:href="#gentle-wave" x="48" y="7" />
        </g>
      </svg>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  position: relative;
  height: 44vh;
  width: 100%;
  color: white;

  /* 封面背景 */
  .status-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 400% !important;
    z-index: -1;
    transition: filter 0.3s;
    filter: var(--cover-filter);
    animation: gradient-flow 15s ease infinite;

    &.cover-loading { background: var(--loading-cover); }
    &.cover-normal  { background: var(--normal-cover); }
    &.cover-error   { background: var(--error-cover); }
    &.cover-warn    { background: var(--warn-cover); }
    &.cover-unknown { background: var(--unknown-cover); }
  }

  .status-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px 80px;

    .site-status {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 20px;
      height: 100%;

      .status-text {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .point {
          position: relative;
          width: 40px;
          height: 40px;
          min-width: 40px;
          background: white;
          border-radius: 50%;
          margin-right: 30px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);

          .pulse-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            animation: breathing 1.5s ease infinite;
            z-index: -1;
          }

          &.point-normal  { background: #a8ffd6; box-shadow: 0 0 20px rgba(59, 214, 114, 0.5); }
          &.point-error   { background: #ff8a9e; box-shadow: 0 0 20px rgba(222, 72, 74, 0.5); }
          &.point-warn    { background: #ffd966; box-shadow: 0 0 20px rgba(243, 156, 18, 0.5); }
          &.point-loading { background: #b8e8ff; box-shadow: 0 0 20px rgba(88, 208, 255, 0.5); }
        }

        .text {
          display: flex;
          flex-direction: column;

          .title {
            font-size: 42px;
            font-weight: bold;
            background: linear-gradient(135deg, #fff 0%, #ffe0f0 50%, #ffd6e8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 12px rgba(255, 255, 255, 0.1);
            letter-spacing: 1px;
          }

          .tip {
            font-size: 14px;
            opacity: 0.9;
            font-family: var(--font-body);
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px;

            .refresh-btn {
              margin-left: 6px;
              font-size: 14px;
              color: rgba(255, 255, 255, 0.9) !important;
            }

            span {
              &::after {
                content: "";
              }
            }
          }
        }
      }
    }
  }

  /* 波浪 */
  .waves-area {
    width: 100%;
    height: 60px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    pointer-events: none;

    @media (max-width: 512px) {
      height: 40px;
    }

    .parallax {
      width: 100%;
      height: 100%;

      use {
        animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
        transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform, fill;
      }

      use:nth-child(1) {
        animation-delay: -2s;
        animation-duration: 7s;
        fill: rgba(255, 230, 243, 0.741);
      }
      use:nth-child(2) {
        animation-delay: -3s;
        animation-duration: 10s;
        fill: rgba(255, 230, 243, 0.51);
      }
      use:nth-child(3) {
        animation-delay: -4s;
        animation-duration: 13s;
        fill: rgba(255, 230, 243, 0.212);
      }
      use:nth-child(4) {
        animation-delay: -5s;
        animation-duration: 20s;
        fill: rgba(255, 214, 232, 0.95);
      }
    }
  }
}

@media (max-width: 768px) {
  header .status-content .site-status .status-text .text .title {
    font-size: 28px;
  }
}
</style>
