'use strict';
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
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '', data: {} };
		// 业务逻辑开始----------------------------------------------------------- 
		// 可写与数据库的交互逻辑等等

		let oid = data._id

		//订单
		res.data.order = await vk.baseDao.findById({
			dbName: "uni-id-base-order",
			id: oid
		});

		//明细
		let goods = await db.collection('order_goods').where({
			oid: oid,
			user_id: uid
		}).get()

		res.data.goods = goods.data

		//支付方式
		let payments = pubFun.getPayConfig().payment.filter(v => v.enabled)

		//根据运行环境 过滤掉不支持的支付行为
		if (data.runtime == 'MP-WEIXIN' || data.runtime == 'WECHAT-H5') {
			payments = payments.filter(v => (v.sign.indexOf("alipay") == -1))
		}

		if (data.runtime == 'MP-ALIPAY') {
			payments = payments.filter(v => (v.sign.indexOf("wxpay") == -1))
		}

		res.data.payment = payments;
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
