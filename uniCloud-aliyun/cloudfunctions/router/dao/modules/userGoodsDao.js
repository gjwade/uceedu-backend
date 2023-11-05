/**
 * 用户购买商品记录表K
 */

const dbName = "user_goods"; // 数据库表名 - 第三方支付订单表
const fnUtil = require('../lib/fnUtil');
const db = uniCloud.database();
const _ = db.command;
var dao = {};

/**
 * 新增用户已购买商品记录
 */
dao.addUserGoods = async (dataJson = {}) => {
	// 数据库操作开始-----------------------------------------------------------
	let date = new Date();
	let _add_time = date.getTime();
	let _add_time_str = fnUtil.timeFormat(date, "yyyy-MM-dd hh:mm:ss");
	let res = await db.collection(dbName).add({
		_add_time,
		_add_time_str,
		...dataJson
	});
	// 数据库操作结束-----------------------------------------------------------
	return res.id ? res.id : null;
}

/**
 * 新增多条用户已购买商品记录
 */
dao.addAllUserGoods = async (dataJson = []) => {
	// 数据库操作开始-----------------------------------------------------------
	let date = new Date();
	let _add_time = date.getTime();
	let _add_time_str = fnUtil.timeFormat(date, "yyyy-MM-dd hh:mm:ss");

	dataJson = dataJson.map(v => {
		return {
			_add_time,
			_add_time_str,
			...v
		}
	})

	let res = await db.collection(dbName).add(dataJson);
	// 数据库操作结束-----------------------------------------------------------
	return res.id ? res.id : null;
}

module.exports = dao;
