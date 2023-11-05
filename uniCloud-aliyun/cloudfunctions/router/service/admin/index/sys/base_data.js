'use strict';
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
		let res = { code: 0, msg: "", data: {} };
		// 业务逻辑开始-----------------------------------------------------------
		// 今日收入
		var today = new Date(new Date().toLocaleDateString()).getTime();
		res.data.t_d_money = await vk.baseDao.sum({
			dbName: "uni-id-base-order",
			fieldName: "total_fee",
			whereJson: {
				status: 2,
				create_time: _.and(_.gt(today), _.lt(today + 24 * 60 * 60 * 1000))
			}
		});

		//昨日收入
		res.data.y_d_money = await vk.baseDao.sum({
			dbName: "uni-id-base-order",
			fieldName: "total_fee",
			whereJson: {
				status: 2,
				create_time: _.and(_.gt(today - 24 * 60 * 60 * 1000), _.lt(today))
			}
		});


		//今日付费订单数
		res.data.t_d_count = await vk.baseDao.count({
			dbName: "uni-id-base-order",
			whereJson: {
				status: 2,
				create_time: _.and(_.gt(today), _.lt(today + 24 * 60 * 60 * 1000))
			}
		});

		//昨日付费订单数
		res.data.y_d_count = await vk.baseDao.count({
			dbName: "uni-id-base-order",
			whereJson: {
				status: 2,
				create_time: _.and(_.gt(today - 24 * 60 * 60 * 1000), _.lt(today))
			}
		});

		//总用户
		res.data.total_user = await vk.baseDao.count({
			dbName: "uni-id-users",
			whereJson: {

			}
		});

		//今日新注册
		res.data.t_d_user = await vk.baseDao.count({
			dbName: "uni-id-users",
			whereJson: {
				register_date: _.and(_.gt(today), _.lt(today + 24 * 60 * 60 * 1000))
			}
		});

		//本月收益
		let CurrentMonth = pubFun.dateRangeUtil.getCurrentMonth()
		res.data.t_m_money = await vk.baseDao.sum({
			dbName: "uni-id-base-order",
			fieldName: "total_fee",
			whereJson: {
				status: 2,
				create_time: _.and(_.gt(CurrentMonth[0].getTime()), _.lt(CurrentMonth[1].getTime()))
			}
		});

		//上月收益
		let PreviousMonth = pubFun.dateRangeUtil.getPreviousMonth()
		res.data.p_m_money = await vk.baseDao.sum({
			dbName: "uni-id-base-order",
			fieldName: "total_fee",
			whereJson: {
				status: 2,
				create_time: _.and(_.gt(PreviousMonth[0].getTime()), _.lt(PreviousMonth[1].getTime()))
			}
		});


		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
