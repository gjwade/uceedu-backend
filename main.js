import Vue from 'vue'
import App from './App'
import store from './store'
import config from '@/app.config.js'

// 引入 elementUI
import elementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(elementUI);

// 引入 高性能表格UI组件
import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css';
Vue.use(UmyUi);

// 引入 vk 实例
import vk from 'uni_modules/vk-unicloud';
Vue.use(vk);


// 初始化 vk框架
Vue.prototype.vk.init({
	Vue, // Vue实例
	config, // 配置
});

// 引入 vkAdminUI 组件
import vkAdminUI from 'vk-unicloud-admin-ui';
import 'vk-unicloud-admin-ui/theme/index.css';
import '@/static/plugs/element/style/theme/index.css';

Vue.use(vkAdminUI);

// 引入自定义全局css样式
import '@/common/css/app.scss';

//引入国际化组件
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

const i18n = new VueI18n({
	locale: config.lang, // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale 
	messages: {
		'zh-CN': require('./common/lang/zh'), // 中文语言包
		'en-US': require('./common/lang/en') // 英文语言包
	}
})

//全局混入少量参数 请勿混入大量数据
Vue.mixin({
	data() {
		return {
			fileProvider: config.provider
		}
	}
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
	i18n,
	...App
})
app.$mount()
