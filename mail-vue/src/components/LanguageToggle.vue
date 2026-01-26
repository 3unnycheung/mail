<template>
  <div class="language-toggle">
    <el-button 
      :type="settingStore.lang === 'zh' ? 'primary' : ''" 
      @click="changeLanguage('zh')"
      size="small"
    >
      中文
    </el-button>
    <el-button 
      :type="settingStore.lang === 'en' ? 'primary' : ''" 
      @click="changeLanguage('en')"
      size="small"
    >
      English
    </el-button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSettingStore } from '@/store/setting.js'

const { locale } = useI18n()
const settingStore = useSettingStore()

const changeLanguage = (lang) => {
  settingStore.lang = lang
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style scoped>
.language-toggle {
  display: flex;
  gap: 8px;
}
</style>
