'use strict';
module.exports = {
	/**
	 * 此函数名称
	 * @url user/pub/test1 前端调用的url参数地址
	 * data 请求参数
	 * @params {String} params1  参数1
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = {
			code: 0,
			msg: ''
		};
		// 业务逻辑开始-----------------------------------------------------------
		// 可写与数据库的交互逻辑等等

		let insertData = {
			"watch_seconds": data.watch_seconds,
			"update_date": new Date().getTime(),
		}

		if (data.watched_at == 1)
			insertData.watched_at = new Date().getTime()

		//先进行更新 失败则插入
		let num = await vk.baseDao.update({
			dbName: "user_video_watch_records",
			whereJson: {
				"user_id": uid,
				"course_id": data.course_id,
				"video_id": data.video_id
			},
			dataJson: insertData
		});

		if (num > 0)
			return res

		//进行插入
		insertData.user_id = uid
		insertData.course_id = data.course_id
		insertData.video_id = data.video_id

		res.id = await vk.baseDao.add({
			dbName: "user_video_watch_records",
			dataJson: insertData
		});



		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
