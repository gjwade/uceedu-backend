module.exports = {
	/**
	 * 添加单条数据
	 * @url admin/kong/sys/add 前端调用的url参数地址
	 * data 请求参数 说明
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: 'ok' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			category_id,
			title,
			content,
			excerpt,
			course_status=3,
			view_count = 0,
			like_count = 0,
			charge,
			is_essence,
			comment_status,
			avatar,
			publish_date,
			publish_ip,
			last_modify_date,
			last_modify_ip,
			mode,
			live_stream
		} = data;

		// course_status
		// { value: 3, label: "未开始" },
		// { value: 4, label: "直播中" },
		// { value: 2, label: "已暂停" },
		// { value: 1, label: "已结束" }
		let dbName = "free_live_course";
		res.id = await vk.baseDao.add({
			dbName,
			dataJson: {
				category_id,
				title,
				content,
				excerpt,
				course_status,
				view_count,
				like_count,
				charge,
				is_essence,
				comment_status,
				avatar,
				publish_date,
				publish_ip,
				last_modify_date,
				last_modify_ip,
				mode,
				live_stream
			}
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
