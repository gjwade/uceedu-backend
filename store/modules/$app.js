/**
 * vuex 系统状态管理模块
 */
import config from '@/app.config.js'

let lifeData = uni.getStorageSync('lifeData') || {};

export default {
	// 通过添加 namespaced: true 的方式使其成为带命名空间的模块
	namespaced: true,
	/**
	 * vuex的基本数据，用来存储变量
	 */
	state: {
		/**
		 * 是否已经初始化
		 * js调用示例
		 * vk.getVuex('$app.inited');
		 * 页面上直接使用示例
		 * {{ vk.getVuex('$app.inited') }}
		 * js更新示例
		 * vk.setVuex('$app.inited', true);
		 */
		inited: lifeData.$app.inited || false,
		config:{
			...config
		},
		// 左侧菜单列表（树形结构） vk.getVuex('$app.navMenu');
		navMenu: lifeData.$app.navMenu || [],
		// 左侧菜单列表（数组形式） vk.getVuex('$app.menuList');
		menuList: lifeData.$app.menuList || [],
		// 菜单地图 vk.getVuex('$app.menuMap');
		menuMap: lifeData.$app.menuMap || [],
		// 当前打开的页面路由信息 vk.getVuex('$app.route'); vk.setVuex('$app.route', route);
		route: lifeData.$app.route || {},
		// 系统后台名称
		appName: process.env.VUE_APP_NAME || '',
		// 屏幕宽度
		width: lifeData.$app.width || '',
		// 屏幕高度
		height: lifeData.$app.height || '',
		// 是否是PC
		isPC: lifeData.$app.isPC || true,
	},
	/**
	 * 从基本数据(state)派生的数据，相当于state的计算属性
	 */
	getters: {

	},
	/**
	 * 提交更新数据的方法，必须是同步的(如果需要异步使用action)。
	 * 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
	 * 回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数，提交载荷作为第二个参数。
	 */
	mutations: {

	},
	/**
	 * 和mutation的功能大致相同，不同之处在于 ==》
	 * 1. Action 提交的是 mutation，而不是直接变更状态。
	 * 2. Action 可以包含任意异步操作。
	 */
	actions: {

	}
}
