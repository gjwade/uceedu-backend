'use strict';
/**
 * 此为支付异步回调专用云函数，你的业务逻辑写在service目录下
 * 如service/goods.js 写商品订单付款成功后的逻辑
 */
const vkPay = require('vk-uni-pay');
const orderPaySuccess = require('./orderPaySuccess');

//url参数转对象
function getQueryObj(url) {
	let arr = url.split("&");
	const resObj = {};
	arr.forEach(item => {
		let [key, value = ''] = item.split("=")
		resObj[key] = value
	})
	return resObj
}

exports.main = async (event, context) => {
	const notifyPath = "/uce-pay-notify/";
	let payType = event.path.substring(notifyPath.length);

	const db = uniCloud.database();
	const _ = db.command;
	let params = getQueryObj(event.body)

	//验证订单真实性
	let res = await uniCloud.callFunction({
		name: "router",
		data: {
			$url: "client/notify/pub/" + payType,
			data: params
		}
	});

	//订单验证通过
	if (res.result) {
		//订单信息
		let payOrderInfo = await db.collection('uni-id-base-order').doc(params.outTradeNo).get();
		let obj = {
			data: {
				...payOrderInfo.data[0],
				out_trade_no: params.outTradeNo,
				total_fee: params.money,
				status: 1,
				notify_time: new Date().getTime()
			},
			verifyResult: true
		}
		if (await orderPaySuccess(obj, { db, _, event, context })) {
			return "SUCCESS"
		}
	}

	return "FAIL"
};
