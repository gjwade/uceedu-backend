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
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let whereJson = {};

		//场景
		switch (data.scene) {
			case 'sticky':
				whereJson["is_sticky"] = 1
				break;
			case 'essence':
				whereJson["is_essence"] = 1
				break;
		}

		//课程分类
		if (data.cid != 0)
			whereJson["category_id"] = data.cid

		//固定参数
		whereJson["publish_date"] = _.lte(pubFun.getNowTimeStr())


		res = await vk.baseDao.getTableData({
			dbName: "opendb-news-articles",
			data,
			whereJson: whereJson,
			fieldJson: { content: false },
			foreignDB: [{
				dbName: "opendb-news-categories",
				localKey: "category_id",
				foreignKey: "_id",
				as: "category",
				limit: 1,
			}],
			sortArr: [{ "name": "sticky", "type": "desc" }, { "name": "publish_date", "type": "desc" }],
		});

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
