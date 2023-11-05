'use strict';
const orderState = require('../../../../../application/service/orderState.js')
const applicationConstant = require('../../../../../application/constant/applicationsConstant.js')
const businessState = require('../../../../../application/service/businessState.js')
const orderPaySuccess = require('../../../../../application/service/orderPaySuccess.js');
module.exports = {
	/**
	 * 创建课程订单
	 * @url client/order/kh/create/course 前端调用的url参数地址
	 * data 请求参数
	 * @params {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		// 可写与数据库的交互逻辑等等

		//检查用户是否已经开通该课程 防止重复下单
		if (await businessState.hasBuyArticles(event, data._id, userInfo)) {
			res.code = -1
			res.msg = "您已购买该图文"
			return res;
		}


		// todo:先检查是否有未关闭订单 有的话直接返回; 不太好直接查询 后面想下办法
		// let order = await vk.baseDao.findByWhereJson({
		// 	dbName: "uni-id-base-order",
		// 	whereJson: {
		// 		"user_id": uid,
		// 		"platform": data.platform,
		// 		"status": 1,
		// 	}
		// });
		// if (true) {
		// 	// res.order_id = order._id
		// 	res.order_id = '61020e8fb1e18c00011c1257'
		// 	return res
		// }

		//新建订单
		let goods = await vk.baseDao.findById({
			dbName: "uce-pay-articles",
			id: data._id,
			whereJson: {
				publish_date: _.lte(pubFun.getNowTimeStr())
			}
		});

		//商品不存在
		if (!goods) {
			res.code = -1
			res.msg = "无效的图文"
			return res;
		}

		//数据准备
		let promoCodeId = ""

		let platform = data.platform

		let title = goods.title

		let total = goods.charge

		let type = applicationConstant.PAY_ARTICLE

		let goods_item = [{
			'oid': null,
			'user_id': uid,
			'goods_id': goods['_id'],
			'charge': goods['charge'],
			'type': type,
			'num': 1,
			'goods_name': "[图文]" + goods['title'],
			'goods_thumb': goods['avatar'],
			'goods_charge': goods['charge'],
			'goods_ori_charge': goods['charge'],
		}]


		//统一创建订单
		res = await orderState.createOrder(event, uid, total, title, type, platform, goods_item, promoCodeId)

		//如果课程价格为0 则直接发货
		if (total == 0 && res.code == 0) {
			let payOrderInfo = await vk.baseDao.findById({
				dbName: 'uni-id-base-order',
				id: res.order_id
			});
			let obj = {
				data: {
					...payOrderInfo,
					out_trade_no: res.order_id,
					total_fee: total,
					status: 1,
					notify_time: new Date().getTime()
				},
				verifyResult: true
			}
			await orderPaySuccess(obj, { db, _ })
		}

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
