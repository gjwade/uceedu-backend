const userGoodsDao = require('../../dao/modules/userGoodsDao.js')

module.exports = async (obj, originalParam) => {
	let user_order_success = true;
	let { data = {}, verifyResult } = obj;
	let { db, _ } = originalParam;
	let {
		out_trade_no,
		total_fee
	} = data;

	//设置订单支付成功
	let order = await db.collection('uni-id-base-order').doc(out_trade_no)
		.update({
			status: 2,
			transaction_id: data.payNo,
			paid_time: new Date().getTime(),
			update_time: new Date().getTime()
		});

	//----发货----
	let goods = await db.collection('order_goods').where({
		oid: out_trade_no
	}).get()

	let ids = []
	let userGoods = goods.data.map(v => {
		//后期可以再加入课程有效期 分销逻辑等
		let item = {
			user_id: v.user_id,
			goods_id: v.goods_id,
			goods_type: v.type,
			oid: v.oid,
		}
		ids.push(v.goods_id)
		return item
	})

	//课程订阅人数+1
	let addRes = await db.collection('course').where({
		_id: _.in(ids)
	}).update({
		"user_count": _.inc(1)
	})

	let res = await userGoodsDao.addAllUserGoods(userGoods)

	return user_order_success;
};
