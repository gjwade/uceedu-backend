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

		//统计发送量 防止刷贴 每一分钟最多发布一次
		var curTimestamp = new Date().getTime();
		let count = await vk.baseDao.count({
			dbName: "bbs_article",
			whereJson: {
				_add_time: _.gt(curTimestamp - 60 * 1000)
			}
		});

		if (count > 0) {
			return {
				code: -1,
				msg: "每1分钟只能提交一次！"
			}
		}



		let {
			category_id,
			content,
			title,
			bbs_status = 1, //0待审核 1审核通过 未解决  2已解决 3已取消
			view_count = 0,
			like_count = 0,
			money = 0
		} = data;

		// 这里需要把 params1 params2 params3 改成你数据库里允许用户添加的字段
		let dbName = "bbs_article";
		res.id = await vk.baseDao.add({
			dbName,
			dataJson: {
				category_id,
				content,
				title,
				bbs_status,
				view_count,
				like_count,
				money,
				uid
			}
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
