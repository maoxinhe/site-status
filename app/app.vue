<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { zhCN, dateZhCN } from "naive-ui";

const { public: configPublic } = useRuntimeConfig();
const config = useRuntimeConfig();
const statusStore = useStatusStore();

// ✅ Naive UI 中文 locale（不再使用 useI18n）
const siteLang = {
  locale: zhCN,
  date: dateZhCN,
};

// ✅ 必须显式导入 ref
const siteLoaded = ref(false);

// 验证登录态
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

// 仅同步 html lang
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
      title: isError ? `( ${error + unknown} ) ${siteTitle}` : siteTitle,
    });
    useFavicon(isError ? "/favicon-error.ico" : "/favicon.ico");
  }
);

// 语言同步
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
                <!-- ✅ 樱花花瓣（替换星星） -->
                <div class="sakura" style="left: 5%; animation-duration: 10s"></div>
                <div class="sakura" style="left: 15%; animation-duration: 12s; animation-delay: 2s"></div>
                <div class="sakura" style="left: 30%; animation-duration: 14s; animation-delay: 1s"></div>
                <div class="sakura" style="left: 50%; animation-duration: 11s; animation-delay: 3s"></div>
                <div class="sakura" style="left: 70%; animation-duration: 13s; animation-delay: 0.5s"></div>
                <div class="sakura" style="left: 85%; animation-duration: 9s; animation-delay: 1.5s"></div>
                <div class="sakura" style="left: 95%; animation-duration: 15s; animation-delay: 2.5s"></div>

                <div v-if="siteLoaded" class="site-wrapper">
                  <SiteHeader />
                  <main class="site-main" @scroll="siteScroll">
                    <SiteCards v-if="statusStore.loginStatus" />
                    <SiteLogin v-else />
                  </main>
                  <SiteFooter />
                </div>

                <div v-else class="site-loading">
                  <div class="loading-heart">🌸</div>
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
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.site-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* ✅ 樱花花瓣 */
.sakura {
  position: fixed;
  top: -10%;
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffb6c1'%3E%3Cpath d='M12 2C11 7 7 9 2 12c5 3 9 5 10 10 1-5 5-7 10-10-5-3-9-9-10-2z'/%3E%3C/svg%3E")
    no-repeat center/contain;
  opacity: 0.8;
  animation: fall linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(120vh) rotate(360deg);
  }
}

/* 加载页 */
.site-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-heart {
  font-size: 3rem;
  animation: heartBeat 1s ease infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 1.3rem;
  color: #d6336c;
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
</style>
