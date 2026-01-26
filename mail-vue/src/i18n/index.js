import { createI18n } from 'vue-i18n';
import en from './en.js';
import zhTw from './zh-tw.js'; // 新增的繁體檔

// 把 'zh' 指向繁體內容，並同時註冊 'zh-TW'。 
// 這樣現有呼叫 $t(...) 且使用 'zh' 的程式會拿到繁體內容。
const messages = {
  en,
  zh: zhTw,
  'zh-TW': zhTw,
};

const i18n = createI18n({
  legacy: false,
  locale: 'zh',        // 預設為繁體
  fallbackLocale: 'en',
  messages,
});

export default i18n;