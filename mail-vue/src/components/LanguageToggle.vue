<template>
  <div class="language-toggle" style="display:flex; gap:8px; align-items:center;">
    <el-button size="small" :type="current==='zh' ? 'primary' : 'default'" @click="switchTo('zh')">繁體中文</el-button>
    <el-button size="small" :type="current==='en' ? 'primary' : 'default'" @click="switchTo('en')">English</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import i18n from '@/i18n/index.js';
import { useSettingStore } from '@/store/setting.js';

const settingStore = useSettingStore();
const current = ref(settingStore.lang || i18n.global.locale.value || 'zh');

function switchTo(lang) {
  if (!lang) return;
  settingStore.lang = lang;
  i18n.global.locale.value = lang;
  current.value = lang;
  try {
    localStorage.setItem('lang', lang);
  } catch (e) {
    // ignore
  }
}
</script>

<style scoped>
.language-toggle { user-select: none; }
</style>