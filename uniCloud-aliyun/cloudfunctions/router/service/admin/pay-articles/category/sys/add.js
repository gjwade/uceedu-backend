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
			name,
			description,
			icon,
			sort,
			is_show
		} = data;
		let article_count = 0

		let dbName = "uce-pay-articles-categories";
		res.id = await vk.baseDao.add({
			dbName,
			dataJson: {
				name,
				description,
				icon,
				sort,
				is_show,
				article_count
			}
		});
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
