/**
 * 第三方支付相关数据库操作
 * 请勿修改此处代码，因为插件更新后此处代码会被覆盖。
 * 作者：VK
 */
const dbNamePayOrders = "uni-pay-orders"; // 数据库表名 - 第三方支付订单表

const fnUtil = require('../fnUtil');

const db = uniCloud.database();
const _ = db.command;
var dao = {};

/**
 * 添加 - 第三方支付订单数据
await payDao.addPayOrders({
	status: 0,
	pay_type : payType,
	out_trade_no : outTradeNo,
	openid : openid,
	totalFee : totalFee,
	appid : appId,
	original_data : event.body,
	wxpay_info : wxpay_info,
	alipay_info : alipay_info,
	user_order_success: userOrderSuccess
});
 */
dao.addPayOrders = async (dataJson = {}) => {
  // 数据库操作开始-----------------------------------------------------------
  let date = new Date();
  let _add_time = date.getTime();
  let _add_time_str = fnUtil.timeFormat(date, "yyyy-MM-dd hh:mm:ss");
  let res = await db.collection(dbNamePayOrders).add({
    _add_time,
    _add_time_str,
    ...dataJson
  });
  // 数据库操作结束-----------------------------------------------------------
  return res.id ? res.id : null;
};

/**
 * 获取 - 第三方支付订单数据
await payDao.findPayOrdersByOutTradeNo(outTradeNo);
 */
dao.findPayOrdersByOutTradeNo = async (out_trade_no = "___") => {
  let res = await db.collection(dbNamePayOrders)
    .where({
      out_trade_no
    })
    .limit(1)
    .get();
  if (res.data && res.data.length > 0) {
    return res.data[0];
  } else {
    return null;
  }
  return res;
};

/**
 * 修改 - 第三方支付订单数据
await payDao.updatePayOrdersById(id, {

});
 */
dao.updatePayOrdersById = async (id = "___", dataJson) => {
  // 数据库操作开始-----------------------------------------------------------
  let res = await db.collection(dbNamePayOrders).doc(id).update(dataJson);
  // 数据库操作结束-----------------------------------------------------------
  return res ? res.updated : 0;
};
/**
 * 修改 - 第三方支付订单数据
await payDao.updatePayOrdersByWhereJson({
  whereJson:{
    status:0,
    out_trade_no
  },
  dataJson:{

  }
});
 */
dao.updatePayOrdersByWhereJson = async (obj) => {
  let { whereJson, dataJson } = obj;
  // 数据库操作开始-----------------------------------------------------------
  let res = await db.collection(dbNamePayOrders).where(whereJson).update(dataJson);
  // 数据库操作结束-----------------------------------------------------------
  return res ? res.updated : 0;
};
/**
 * 删除超过1天还未支付款的订单
await payDao.deleteExpPayOrders();
 */
dao.deleteExpPayOrders = async () => {
  // 数据库操作开始-----------------------------------------------------------
  let time = new Date().getTime() - 1000 * 3600 * 24;
  let res = await db.collection(dbNamePayOrders)
    .where({
      status: 0,
      _add_time: _.lt(time)
    })
    .remove();
  // 数据库操作结束-----------------------------------------------------------
  return res ? res.updated : 0;
};

module.exports = dao;
