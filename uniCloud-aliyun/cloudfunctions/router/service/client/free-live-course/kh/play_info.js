'use strict';
const businessState = require('../../../../application/service/businessState.js')
module.exports = {
	/**
	 * 此函数名称
	 * @url user/pub/test1 前端调用的url参数地址
	 * @description 此函数描述
	 * @params {Object} data 请求参数
	 * @params {String} uniIdToken 用户token
	 * @params {String} userInfo 当前登录用户信息（可信任，仅kh目录下的函数有此值）
	 * pub目录下请求参数需要带上 need_user_info = true
	 * @params {Object} util 公共工具包
	 * @params {Object} filterResponse 过滤器返回的数据
	 * @params {Object} originalParam 原始请求参数（包含了原始event和context）
	 * data 请求参数 说明
	 * @params {String} uid 当前登录用户id（可信任，仅kh目录下的函数有此值）
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		//  注意: userInfo 和 uid 是可信任的，但默认只有kh目录下的函数才有此值
		let { data = {}, userInfo, util, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = {
			code: 0,
			msg: ''
		};
		// 业务逻辑开始----------------------------------------------------------- 

		//获取用户课程购买情况
		let has_buy = await businessState.hasBuyFreeLiveCourses(event, data._id, userInfo)
		if (!has_buy) {
			res.url = ""
			return res
		}

		let Cdata = await vk.baseDao.findById({
			dbName: "free_live_course",
			id: data._id
		});
		//有自定义流 显示自定义流
		if (Cdata.live_stream)
			res.url = Cdata.live_stream
		else {
			//获取直播流地址
			res.url = ""
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
