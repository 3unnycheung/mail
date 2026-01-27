import { createI18n } from 'vue-i18n';
import en from './en.js'
import zhTw from './zh-tw.js'
const i18n = createI18n({
    legacy: false,
    messages: {
        zh: zhTw,
        en
    },
});

export default i18n;