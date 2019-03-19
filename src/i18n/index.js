import Vue from 'vue'
import VueI18n from 'vue-i18n'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW'

import enPlatform from './en'
import zhPlatform from './zh-CN'
import zhTWPlatform from './zh-TW'

Vue.use(VueI18n)

// 国际化
const messages = {
	en: {
		...enLocale,
		...enPlatform
	},
	zh: {
		...zhLocale,
		...zhPlatform
	},
	zhtw: {
		...zhTWLocale,
		...zhTWPlatform
	}
};

const i18n = new VueI18n({
	locale: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh',
	messages
})

Vue.use({
	i18n: (key, value) => i18n._t(key, value)
});

export default i18n;



// WEBPACK FOOTER //
// ./src/i18n/index.js