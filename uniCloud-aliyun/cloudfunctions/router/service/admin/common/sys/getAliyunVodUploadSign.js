'use strict';
const aliyunVod = require('../../../../application/service/aliyunVod.js')
module.exports = {
	/**
	 * 获取阿里云视频上传凭证
	 * @url user/pub/test1 前端调用的url参数地址
	 * data 请求参数
	 * @param {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		// 可写与数据库的交互逻辑等等
		let title = data.title
		let fileName = data.name

		res.data = await aliyunVod.CreateUploadVideo(title, fileName)

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
