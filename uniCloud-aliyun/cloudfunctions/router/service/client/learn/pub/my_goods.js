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
		let { pageIndex = 1, pageSize = 10, uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		// 可写与数据库的交互逻辑等等

		if (uid == null) {
			res.code = -1
			res.msg = "请登录后查看"
			return res
		}

		let whereJson = {};
		//场景
		switch (data.scene) {
			case 'course':
				whereJson["goods_type"] = 'course'
				break;
			case 'pay-article':
				whereJson["goods_type"] = 'pay-article'
				break;
		}
		whereJson['user_id'] = uid

		res = await vk.baseDao.selects({
			dbName: "user_goods",
			whereJson: whereJson,
			pageIndex: pageIndex,
			pageSize: pageSize,
			sortArr: [{
				"name": "_add_time",
				"type": "desc"
			}],
			fieldJson: { render_desc: false },
			// 副表列表
			foreignDB: [{
					dbName: "course",
					localKey: "goods_id",
					foreignKey: "_id",
					as: "courseInfo",
					fieldJson: { render_desc: false },
					limit: 1
				},
				{
					dbName: "uce-pay-articles",
					localKey: "goods_id",
					foreignKey: "_id",
					as: "articleInfo",
					fieldJson: { free_content: false, content: false },
					limit: 1
				}
			]
		});


		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
