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
			case 'rec':
				whereJson["is_rec"] = 1
				break;
			case 'free':
				whereJson["charge"] = 0
				break;
			case 'discount':
				whereJson["charge_original"] = _.gt(0)
				break;
		}

		//课程分类
		if (data.cid != 0)
			whereJson["category_id"] = data.cid

		//固定参数
		whereJson["published_at"] = _.lte(pubFun.getNowTimeStr())
		whereJson["is_show"] = 1


		res = await vk.baseDao.getTableData({
			dbName: "course",
			data,
			whereJson: whereJson,
			fieldJson: { render_desc: false }
		});

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
