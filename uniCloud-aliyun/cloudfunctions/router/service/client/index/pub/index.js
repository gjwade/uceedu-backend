'use strict';
const applicationsConstant = require('../../../../application/constant/applicationsConstant.js')
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
		//幻灯片
		res.data.sliders = (await vk.baseDao.select({
			dbName: "sliders",
			whereJson: {
				platform: data.platform,
				status: true,
			},
			sortArr: [{ "name": "sort", "type": "asc" }],
		})).rows;


		//自定义导航
		res.data.home_nav = (await vk.baseDao.select({
			dbName: "home_nav",
			whereJson: {
				platform: data.platform,
				status: true,
			},
			sortArr: [{ "name": "sort", "type": "asc" }],
		})).rows;

		//课程推荐 随机获取5条
		if (pubFun.appIsActive(applicationsConstant.COURSE)) {
			let whereJson = {};
			whereJson["published_at"] = _.lte(pubFun.getNowTimeStr())
			whereJson["is_show"] = 1
			whereJson["is_rec"] = 1

			res.data.course_rec = await vk.baseDao.sample({
				dbName: "course",
				size: 5,
				whereJson: whereJson,
				fieldJson: { render_desc: false }
			});
		}

		//文章推荐 随机5条
		if (pubFun.appIsActive(applicationsConstant.ARTICLE)) {
			let whereJson = {};
			whereJson["publish_date"] = _.lte(pubFun.getNowTimeStr())
			whereJson["is_essence"] = 1

			res.data.article_rec = await vk.baseDao.sample({
				dbName: "opendb-news-articles",
				size: 5,
				whereJson: whereJson,
				fieldJson: { content: false }
			});
		}

		//付费图文 随机5条
		if (pubFun.appIsActive(applicationsConstant.PAY_ARTICLE)) {
			let whereJson = {};
			whereJson["publish_date"] = _.lte(pubFun.getNowTimeStr())
			whereJson["is_essence"] = 1

			res.data.pay_article_rec = await vk.baseDao.sample({
				dbName: "uce-pay-articles",
				size: 5,
				whereJson: whereJson,
				fieldJson: { content: false }
			});
		}
		
		//公开课 3条
		if (pubFun.appIsActive(applicationsConstant.FERR_LIVE_COURSE)) {
			let whereJson = {};		
			res.data.free_live_course = await vk.baseDao.sample({
				dbName: "free_live_course",
				size: 3,
				whereJson: whereJson,
				fieldJson: { content: false },
				sortArr: [{ "name": "course_status","type": "desc" },{ "name": "publish_date","type": "asc" }],
			});
		}
		
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
