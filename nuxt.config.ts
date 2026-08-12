import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import pkg from "./package.json";

// site env
const siteConfig = {
  siteTitle: process.env.SITE_TITLE || "IMSYY 站点监测",
  siteDescription: process.env.SITE_DESCRIPTION || "一个简约的站点监测",
  siteKeywords: process.env.SITE_KEYWORDS || "站点监测,监测,监控",
  siteLogo: process.env.SITE_LOGO || "/favicon.ico",
  siteIcp: process.env.SITE_ICP || "",
  countDays: Number(process.env.COUNT_DAYS || 60),
  showLink: process.env.SHOW_LINK === "true" || true,
  platform: process.env.DEPLOYMENT_PLATFORM || "cloudflare",
  version: pkg.version,
};

export default defineNuxtConfig({
  // modules
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate",
    "@nuxt/eslint",
    "nuxtjs-naive-ui",
    "@vite-pwa/nuxt",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-lodash",
    // ✅ 关键：彻底移除 @nuxtjs/i18n，解决 Cloudflare 500
  ].concat(siteConfig.platform === "cloudflare" ? "@nuxthub/core" : ""),

  ssr: false,
  devtools: { enabled: true },

  app: {
    rootAttrs: { id: "nuxt-app" },
    head: {
      title: siteConfig.siteTitle,
      meta: [
        { name: "description", content: siteConfig.siteDescription },
        { name: "keywords", content: siteConfig.siteKeywords },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { name: "theme-color", content: "#ffd6e8" },
      ],
      link: [
        { rel: "icon", href: siteConfig.siteLogo },
        {
          rel: "apple-touch-icon",
          href: "/images/icons/normal/apple-touch-icon-180x180.png",
          sizes: "180x180",
        },
        {
          rel: "mask-icon",
          href: "/images/icons/normal/maskable-icon-512x512.png",
          color: "#ffffff",
        },
        // ✅ 奶酪体手写字体
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Ma+Shan+Zheng&display=swap",
        },
        // manifest
        process.env.NODE_ENV !== "development"
          ? { rel: "manifest", href: "/manifest.webmanifest" }
          : undefined,
      ],
      htmlAttrs: {
        lang: "zh-CN",
      },
    },
  },

  css: ["~/style/main.scss", "~/style/animate.scss"],

  runtimeConfig: {
    apiUrl: process.env.API_URL || "https://api.uptimerobot.com/v2/",
    apiKey: process.env.API_KEY,
    sitePassword: process.env.SITE_PASSWORD,
    siteSecretKey: process.env.SITE_SECRE_KEY || "site-status",
    public: siteConfig,
  },

  devServer: { port: 8566 },
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2024-11-11",

  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
  },

  eslint: {
    config: {
      stylistic: {
        quotes: "double",
        semi: true,
      },
    },
  },

  icon: {
    mode: "svg",
    customCollections: [
      {
        prefix: "icon",
        dir: "./app/assets/icons",
        normalizeIconName: false,
      },
    ],
  },

  pwa: {
    manifest: {
      name: siteConfig.siteTitle,
      short_name: siteConfig.siteDescription,
      description: siteConfig.siteDescription,
      theme_color: "#ffd6e8",
      icons: [
        { src: "/images/icons/normal/pwa-64x64.png", sizes: "64x64", type: "image/png" },
        { src: "/images/icons/normal/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/images/icons/normal/pwa-512x512.png", sizes: "512x512", type: "image/png" },
        { src: "/images/icons/normal/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
  },
});
