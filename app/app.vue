<script setup lang="ts">
import { zhCN, dateZhCN } from "naive-ui";

const { public: configPublic } = useRuntimeConfig();
const config = useRuntimeConfig();
const statusStore = useStatusStore();

// ✅ 不再使用 useI18n
// ✅ 直接定义 Naive UI 需要的 locale（中文）
const siteLang = {
  locale: zhCN,
  date: dateZhCN,
};

// 加载状态
const siteLoaded = ref(false);

// 验证状态
const checkSite = async () => {
  try {
    const result = await $fetch("/api/check", { method: "POST" });
    statusStore.loginStatus = result.code === 200;
  } catch (error) {
    console.error("error in checkSite", error);
  } finally {
    siteLoaded.value = true;
  }
};

// 页面滚动
const siteScroll = (e: Event) => {
  const scrollTop = (e.target as HTMLElement).scrollTop;
  statusStore.scrollTop = scrollTop;
};

// ✅ 不再调用 setLocale
// ✅ 仅设置 html lang 属性
const setSiteLang = (lang: string) => {
  useHead({ htmlAttrs: { lang } });
};

// 监听站点状态
watch(
  () => statusStore.siteStatus,
  (status) => {
    const { siteTitle } = config.public;
    const isError = status === "error" || status === "warn";
    const error = statusStore.siteData?.status?.error || 0;
    const unknown = statusStore.siteData?.status?.unknown || 0;
    useHead({
      title: isError ? `( ${error + unknown} ) ` + siteTitle : siteTitle,
    });
    useFavicon(isError ? "/favicon-error.ico" : "/favicon.ico");
  }
);

// 语言更改（现在只是同步 html lang）
watch(() => statusStore.siteLang, setSiteLang);

onBeforeMount(checkSite);

onMounted(() => {
  setSiteLang("zh-CN");
});
</script>

<template>
  <NConfigProvider
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="siteLang.locale"
    :date-locale="siteLang.date"
  >
    <NMessageProvider>
      <NModalProvider>
        <NDialogProvider>
          <NNotificationProvider>
            <NLoadingBarProvider>
              <GlobalProvider>
                <div v-if="siteLoaded" class="site-wrapper">
                  <!-- 背景装饰星星 -->
                  <div class="bg-stars" aria-hidden="true">
                    <span class="star" style="top: 8%; left: 12%; animation-delay: 0s;"></span>
                    <span class="star" style="top: 15%; left: 80%; animation-delay: 1.2s;"></span>
                    <span class="star" style="top: 35%; left: 25%; animation-delay: 0.6s;"></span>
                    <span class="star" style="top: 55%; left: 70%; animation-delay: 2s;"></span>
                    <span class="star" style="top: 72%; left: 40%; animation-delay: 0.8s;"></span>
                    <span class="star" style="top: 25%; left: 55%; animation-delay: 1.5s;"></span>
                    <span class="star" style="top: 65%; left: 90%; animation-delay: 0.3s;"></span>
                    <span class="star" style="top: 85%; left: 15%; animation-delay: 1.8s;"></span>
                  </div>

                  <!-- 头部 -->
                  <SiteHeader />

                  <!-- 主内容 -->
                  <main class="site-main" @scroll="siteScroll">
                    <SiteCards v-if="statusStore.loginStatus" />
                    <SiteLogin v-else />
                  </main>

                  <!-- 底部 -->
                  <SiteFooter />
                </div>

                <!-- 加载中 -->
                <div v-else class="site-loading">
                  <div class="loading-heart">💗</div>
                  <p class="loading-text font-cheese">加载中...</p>
                </div>
              </GlobalProvider>
            </NLoadingBarProvider>
          </NNotificationProvider>
        </NDialogProvider>
      </NModalProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style lang="scss" scoped>
.site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.site-main {
  flex: 1;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 2;
}

.bg-stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  .star {
    position: absolute;
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: twinkle 3s ease-in-out infinite;
    box-shadow: 0 0 6px rgba(255, 182, 213, 0.6);
  }
}

.site-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  .loading-heart {
    font-size: 3rem;
    animation: heartBeat 1s ease infinite;
  }

  .loading-text {
    margin-top: 16px;
    font-size: 1.3rem;
    color: #d6336c;
  }
}

@keyframes heartBeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.dark-mode .bg-stars .star {
  background: rgba(200, 180, 255, 0.6);
  box-shadow: 0 0 8px rgba(180, 150, 255, 0.4);
}
</style>
