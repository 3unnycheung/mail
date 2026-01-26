<template>
  <div class="language-toggle">
    <el-button 
      :type="settingStore.lang === 'zh' ? 'primary' : ''" 
      size="small"
      @click="switchLanguage('zh')"
    >
      繁體中文
    </el-button>
    <el-button 
      :type="settingStore.lang === 'en' ? 'primary' : ''" 
      size="small"
      @click="switchLanguage('en')"
    >
      English
    </el-button>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/store/setting.js'
import i18n from '@/i18n/index.js'

const settingStore = useSettingStore()

const switchLanguage = (lang) => {
  settingStore.lang = lang
  i18n.global.locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style scoped>
.language-toggle {
  display: flex;
  gap: 8px;
}
</style>
