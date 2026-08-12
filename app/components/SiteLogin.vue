<script setup lang="ts">
import { ref } from "vue";

const statusStore = useStatusStore();
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const handleLogin = async () => {
  if (!password.value) {
    errorMsg.value = "请输入密码 💗";
    return;
  }

  loading.value = true;
  errorMsg.value = "";

  try {
    const result = await $fetch("/api/login", {
      method: "POST",
      body: { password: password.value },
    });

    if (result.code === 200) {
      statusStore.loginStatus = true;
      // 刷新数据
      await getSiteData();
    } else {
      errorMsg.value = "密码错误，再试试吧 🤔";
      password.value = "";
    }
  } catch (err) {
    errorMsg.value = "登录失败，请稍后重试";
    console.error("login error:", err);
  } finally {
    loading.value = false;
  }
};

// 回车提交
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") handleLogin();
};
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card glass-card">
      <div class="login-icon">🔐</div>
      <h2 class="login-title font-cheese">站点已加密</h2>
      <p class="login-tip">请输入访问密码</p>

      <NInput
        v-model:value="password"
        type="password"
        placeholder="输入密码..."
        size="large"
        :disabled="loading"
        @keydown="handleKeydown"
        class="login-input"
      />

      <NButton
        type="primary"
        size="large"
        :loading="loading"
        block
        @click="handleLogin"
        class="login-btn"
      >
        {{ loading ? "验证中..." : "💗 进入站点" }}
      </NButton>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

      <div class="login-footer">
        <span class="font-cheese">Powered by</span>
        <a href="https://github.com/imsyy/site-status" target="_blank" rel="noopener">
          site-status
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 40px 20px;
}

.login-card {
  padding: 48px 40px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  animation: floatUp 0.6s ease forwards;

  .login-icon {
    font-size: 3rem;
    margin-bottom: 12px;
    animation: heartBeat 2s ease infinite;
  }

  .login-title {
    font-size: 1.6rem;
    color: #d6336c;
    margin-bottom: 6px;
  }

  .login-tip {
    font-size: 0.85rem;
    color: #8a4a6a;
    margin-bottom: 24px;
    font-family: var(--font-body);
  }

  .login-input {
    margin-bottom: 20px;

    :deep(.n-input) {
      border-radius: 12px !important;
      background: rgba(255, 255, 255, 0.6) !important;
      border: 1px solid rgba(214, 51, 108, 0.2) !important;
      font-size: 1rem;

      &:focus-within {
        border-color: rgba(214, 51, 108, 0.5) !important;
        box-shadow: 0 0 0 2px rgba(214, 51, 108, 0.1) !important;
      }
    }
  }

  .login-btn {
    border-radius: 12px !important;
    background: linear-gradient(135deg, #ff9a9e 0%, #fbc2eb 100%) !important;
    color: white !important;
    font-family: var(--font-cheese);
    font-size: 1.1rem;
    border: none !important;
    box-shadow: 0 4px 16px rgba(214, 51, 108, 0.25);
    height: 44px;
    transition: all 0.25s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(214, 51, 108, 0.35) !important;
      filter: brightness(1.05);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .error-msg {
    margin-top: 14px;
    font-size: 0.82rem;
    color: #c0392b;
    font-family: var(--font-body);
    animation: shake 0.4s ease;
  }

  .login-footer {
    margin-top: 24px;
    font-size: 0.78rem;
    color: #a06080;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    a {
      color: #d6336c;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-6px); }
  75%      { transform: translateX(6px); }
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.1); }
}

@media (max-width: 480px) {
  .login-card {
    padding: 36px 24px;
  }
}
</style>
