<script setup lang="ts">
const { public: configPublic } = useRuntimeConfig();
const { siteIcp, version } = configPublic;

const linkData = {
  github: "https://github.com/imsyy/site-status",
  home: "https://www.imsyy.top",
  email: "mailto:one@imsyy.top",
};
</script>

<template>
  <footer class="site-footer">
    <div class="footer-deco" aria-hidden="true">
      <span>🧀</span>
      <span>💗</span>
      <span>🌸</span>
    </div>
    <div class="text">
      <p class="font-cheese footer-title">SiteStatus</p>
      <p>
        Version {{ version }}
      </p>
      <p>
        <NText @click="window.open(linkData.github)">GitHub</NText>
        |
        <NText @click="window.open(linkData.home)">IMSYY</NText>
      </p>
      <p class="footer-tip">
        {{ $t("footer.basedOn") }}
        <NText @click="window.open('https://uptimerobot.com')">UptimeRobot</NText>
      </p>
      <p class="footer-tip">
        {{ $t("footer.interface") }} |
        {{ $t("footer.checkFrequency") }}
        {{ $t("footer.fiveMinutes") }}
      </p>
      <p class="footer-copy">
        Copyright &copy; 2020 - {{ new Date().getFullYear() }}
        <NText @click="window.open(linkData.home)">IMSYY</NText>
        <span v-if="siteIcp"> | {{ siteIcp }}</span>
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.site-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 60px;
  margin-top: auto;
  z-index: 100;
  position: relative;

  .footer-deco {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
    font-size: 1.2rem;
    opacity: 0.7;

    span {
      animation: twinkle 3s ease-in-out infinite;
      &:nth-child(2) { animation-delay: 1s; }
      &:nth-child(3) { animation-delay: 2s; }
    }
  }

  .text {
    margin-top: 8px;
    text-align: center;

    p {
      margin: 0;
      font-size: 13px;
      line-height: 26px;
      color: #8a4a6a;
      font-family: var(--font-body);
    }

    .footer-title {
      font-size: 1.2rem;
      color: #d6336c;
      margin-bottom: 6px;
    }

    .n-text {
      font-weight: bold;
      cursor: pointer;
      color: #d6336c;
      font-family: var(--font-cheese);
      transition: color 0.2s;

      &:hover {
        color: #ff6b9d;
      }
    }

    .footer-tip {
      font-size: 0.78rem;
      opacity: 0.7;
    }

    .footer-copy {
      margin-top: 6px;
      font-size: 0.75rem;
      opacity: 0.55;
    }
  }
}
</style>
