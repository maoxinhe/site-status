<script setup lang="ts">
import type { MonitorInfo } from "~/types";

const statusStore = useStatusStore();
const { t } = useI18n();

// 监控数据
const monitors = computed<MonitorInfo[]>(
  () => statusStore.siteData?.monitors || [],
);

// 按状态分组
const sortedMonitors = computed(() => {
  const list = [...monitors.value];
  // 在线 > 警告 > 离线 > 未知
  const order: Record<string, number> = {
    normal: 0,
    warn: 1,
    error: 2,
    unknown: 3,
    loading: 4,
  };
  return list.sort(
    (a, b) =>
      (order[a.status || "unknown"] ?? 9) - (order[b.status || "unknown"] ?? 9),
  );
});

// 状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    normal: "✅ 在线",
    error: "❌ 离线",
    warn: "⚠️ 警告",
    unknown: "❓ 未知",
    loading: "⏳ 检测中",
  };
  return map[status] || "❓ 未知";
};

// 状态点颜色
const getStatusClass = (status: string) => `dot-${status || "unknown"}`;
</script>

<template>
  <div class="site-cards">
    <!-- 统计概览卡片 -->
    <div class="overview-card glass-card">
      <div class="overview-item">
        <span class="overview-num text-pink-gradient">{{ monitors.length }}</span>
        <span class="overview-label">总监控数</span>
      </div>
      <div class="overview-item">
        <span class="overview-num text-pink-gradient">
          {{ monitors.filter((m) => m.status === "normal").length }}
        </span>
        <span class="overview-label">在线</span>
      </div>
      <div class="overview-item">
        <span class="overview-num" style="color: #ff6b8a;">
          {{ monitors.filter((m) => m.status === "error").length }}
        </span>
        <span class="overview-label">离线</span>
      </div>
      <div class="overview-item">
        <span class="overview-num text-pink-gradient">
          {{
            monitors.length > 0
              ? (
                  monitors.reduce((s, m) => s + (m.uptime || 0), 0) /
                  monitors.length
                ).toFixed(2) + "%"
              : "-"
          }}
        </span>
        <span class="overview-label">平均在线率</span>
      </div>
    </div>

    <!-- 监控卡片列表 -->
    <div class="cards-list">
      <div
        v-for="(monitor, index) in sortedMonitors"
        :key="monitor.id"
        class="monitor-card glass-card"
        :style="{ animationDelay: `${index * 0.06}s` }"
      >
        <!-- 卡片头部 -->
        <div class="card-header">
          <div class="card-title-row">
            <span class="status-dot" :class="getStatusClass(monitor.status)"></span>
            <span class="card-title font-cheese">{{ monitor.name }}</span>
          </div>
          <span class="status-badge" :class="`badge-${monitor.status}`">
            {{ getStatusText(monitor.status || "unknown") }}
          </span>
        </div>

        <!-- 卡片内容 -->
        <div class="card-body">
          <div class="info-row">
            <span class="info-label">在线率</span>
            <span class="info-value text-pink-gradient">
              {{ (monitor.uptime || 0).toFixed(2) }}%
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">响应时间</span>
            <span class="info-value">{{ monitor.responsetime || "-" }} ms</span>
          </div>
          <div class="info-row">
            <span class="info-label">监控类型</span>
            <span class="info-value">{{ monitor.type || "-" }}</span>
          </div>
          <div v-if="monitor.url" class="info-row">
            <span class="info-label">地址</span>
            <span class="info-value url-text">{{ monitor.url }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="monitors.length === 0" class="empty-state glass-card">
      <div class="empty-icon">📡</div>
      <p class="empty-text font-cheese">暂无监控数据</p>
      <p class="empty-tip">请在 UptimeRobot 中添加监控项</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.site-cards {
  padding: 20px 0;
}

/* 概览卡片 */
.overview-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;

  .overview-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .overview-num {
      font-size: 1.6rem;
      font-weight: 700;
      font-family: var(--font-cheese);
    }

    .overview-label {
      font-size: 0.8rem;
      color: #8a4a6a;
      font-family: var(--font-body);
    }
  }
}

/* 卡片列表 */
.cards-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* 单个监控卡片 */
.monitor-card {
  padding: 18px 20px;
  opacity: 0;
  animation: floatUp 0.5s ease forwards;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 8px;

      .card-title {
        font-size: 1.1rem;
        color: #d6336c;
      }
    }

    .status-badge {
      font-size: 0.75rem;
      padding: 3px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.5);
      color: #7a2a4d;
      border: 1px solid rgba(214, 51, 108, 0.15);

      &.badge-normal  { background: rgba(59, 214, 114, 0.15); color: #1a8a4a; border-color: rgba(59, 214, 114, 0.3); }
      &.badge-error   { background: rgba(255, 107, 138, 0.15); color: #c0392b; border-color: rgba(255, 107, 138, 0.3); }
      &.badge-warn    { background: rgba(255, 179, 71, 0.15); color: #b8860b; border-color: rgba(255, 179, 71, 0.3); }
      &.badge-unknown { background: rgba(168, 168, 192, 0.15); color: #555; border-color: rgba(168, 168, 192, 0.3); }
    }
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .info-label {
        font-size: 0.85rem;
        color: #8a4a6a;
        font-family: var(--font-body);
      }

      .info-value {
        font-size: 0.95rem;
        font-weight: 600;
        color: #5a2a4a;
        font-family: var(--font-body);
        font-variant-numeric: tabular-nums;

        &.url-text {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.8rem;
          color: #a06080;
        }
      }
    }
  }

  /* 状态点 */
  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;

    &.dot-normal  { background: var(--normal-color); box-shadow: 0 0 10px rgba(59, 214, 114, 0.5); }
    &.dot-error   { background: var(--error-color);  box-shadow: 0 0 10px rgba(255, 107, 138, 0.5); }
    &.dot-warn    { background: var(--warn-color);   box-shadow: 0 0 10px rgba(255, 179, 71, 0.5); }
    &.dot-unknown { background: var(--unknown-color);box-shadow: 0 0 10px rgba(168, 168, 192, 0.4); }
    &.dot-loading { background: var(--loading-color);box-shadow: 0 0 10px rgba(255, 154, 158, 0.5); }
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 1.3rem;
    color: #d6336c;
    margin-bottom: 6px;
  }

  .empty-tip {
    font-size: 0.85rem;
    color: #8a4a6a;
  }
}

/* 响应式 */
@media (max-width: 640px) {
  .cards-list {
    grid-template-columns: 1fr;
  }
  .overview-card {
    padding: 16px;
  }
}
</style>
