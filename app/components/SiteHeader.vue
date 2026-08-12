<script setup lang="ts">
const statusStore = useStatusStore();

// 主题切换
const toggleColorMode = () => {
  const mode = statusStore.siteColorMode === "dark" ? "light" : "dark";
  statusStore.siteColorMode = mode;
  useColorMode().preference = mode;
};
// 如果你想保留按钮样式但不功能生效，可以留空
const toggleLang = () => {
  // 暂不切换语言，固定中文
};
</script>

<template>
  <nav class="site-nav glass-card">
    <!-- Logo / 标题 -->
    <div class="nav-brand font-cheese" @click="scrollToTop">
      <span class="brand-icon">🌸</span>
      <span class="brand-text text-pink-gradient">站点监测</span>
    </div>

    <!-- 右侧操作 -->
    <div class="nav-actions">
      <!-- 语言切换（已禁用，固定中文） -->
      <NButton
        quaternary
        circle
        size="small"
        @click="toggleLang"
        class="nav-btn"
        title="当前语言：中文"
      >
        <span class="btn-emoji">🇨🇳</span>
      </NButton>

      <!-- 主题切换 -->
      <NButton
        quaternary
        circle
        size="small"
        @click="toggleColorMode"
        class="nav-btn"
        title="切换主题"
      >
        <span class="btn-emoji">
          {{ statusStore.siteColorMode === "dark" ? "🌙" : "☀️" }}
        </span>
      </NButton>

      <!-- 刷新 -->
      <NButton
        quaternary
        circle
        size="small"
        @click="getSiteData()"
        class="nav-btn"
        title="刷新数据"
      >
        <span class="btn-emoji">🔄</span>
      </NButton>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  margin: 0 auto 16px;
  max-width: 900px;
  border-radius: 14px;
  position: sticky;
  top: 12px;
  z-index: 100;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 1.15rem;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.03);
    }

    .brand-icon {
      font-size: 1.3rem;
    }

    .brand-text {
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 6px;

    .nav-btn {
      width: 36px;
      height: 36px;
      border-radius: 50% !important;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.3) !important;
      border: 1px solid rgba(255, 255, 255, 0.35) !important;

      &:hover {
        background: rgba(255, 255, 255, 0.55) !important;
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 4px 12px rgba(214, 51, 108, 0.2);
      }

      .btn-emoji {
        font-size: 1rem;
      }
    }
  }
}

@media (max-width: 640px) {
  .site-nav {
    padding: 8px 14px;
    margin-bottom: 12px;

    .nav-brand {
      font-size: 1rem;
    }
  }
}
</style>
