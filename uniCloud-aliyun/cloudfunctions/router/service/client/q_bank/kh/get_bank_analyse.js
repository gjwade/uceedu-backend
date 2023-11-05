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
		let res = {
			code: 0,
			msg: "",
			data: {
				todaySum: 0,
				totalSum: 0,
				totalDay: 0,
			}
		};
		// 业务逻辑开始-----------------------------------------------------------
		// 统计用户所有的
		let commonTime = vk.pubfn.getCommonTime(new Date());

		//今天做题量
		res.data.todaySum = await vk.baseDao.sum({
			dbName: "q_answercard_his", // 表名
			fieldName: "num", // 需要求和的字段名
			whereJson: {
				uid,
				_add_time: _.gte(commonTime.todayStart)
			}
		});

		//总做题量
		res.data.totalSum = await vk.baseDao.sum({
			dbName: "q_answercard_his", // 表名
			fieldName: "num", // 需要求和的字段名
			whereJson: {
				uid
			}
		});

		//做题天数

		//下面为什么会报错 jql中也没问题呀？
		// res.data.totalDay = db.collection('q_answercard_his')
		// 	.where({
		// 		uid: uid
		// 	})
		// 	.field('_add_date_str')
		// 	.distinct()
		// 	.get()

		res.data.totalDay = await vk.baseDao.count({
			dbName: "q_answercard_his", // 表名
			whereJson: {
				uid
			}
		});

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
