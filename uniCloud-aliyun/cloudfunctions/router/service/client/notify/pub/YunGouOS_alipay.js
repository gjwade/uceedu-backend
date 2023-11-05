'use strict';
const YunGouPay = require('../../../../application/service/YunGouPay.js')
module.exports = {
	/**
	 * 此函数名称
	 * @url user/pub/test1 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;

		console.log(event)
		// 业务逻辑开始-----------------------------------------------------------
		// 可写与数据库的交互逻辑等等
		return (await YunGouPay.checkNotify(data, "YunGouOS_alipay", { db, _, vk, ...originalParam }))

		// if (res)
		// 	return "SUCCESS"
		// else
		// 	return "FAIL"
	}
}
