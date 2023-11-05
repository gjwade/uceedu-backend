module.exports = {
	/**
	 * 查询多条记录 分页
	 * @url admin/kong/sys/getList 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {Number}         pageIndex 当前页码
	 * @param {Number}         pageSize  每页显示数量
	 * @param {Array<Object>}  sortRule  排序规则
	 * @param {object}         formData  查询条件数据源
	 * @param {Array<Object>}  columns   查询条件规则
	 * res 返回参数说明
	 * @param {Number}         code      错误码，0表示成功
	 * @param {String}         msg       详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let whereJson = {};

		//场景
		switch (data.scene) {
			case 'solved':
				whereJson["bsb_status"] = 2
				break;
			case 'unsolved':
				whereJson["bsb_status"] = 1
				break;
		}

		//课程分类
		if (data.cid != 0)
			whereJson["category_id"] = data.cid

		// 要关联取出 评论条数
		let dbName = "bbs_article";
		res = await vk.baseDao.getTableData({
			dbName,
			data,
			whereJson,
			sortArr: [
				{ "name": "_add_time", "type": "desc" }
			],
			fieldJson: { title: true, uid: true, category_id: true, bsb_status: true, money: true },
			foreignDB: [{
					dbName: "uni-id-users",
					localKey: "uid",
					foreignKey: "_id",
					as: "user",
					fieldJson: { nickname: true, avatar: true },
					limit: 1,
				},
				{
					dbName: "bbs_category",
					localKey: "category_id",
					foreignKey: "_id",
					as: "categoey",
					fieldJson: { name: true },
					limit: 1,
				},
				{
					dbName: "bbs_comments",
					localKey: "_id",
					foreignKey: "aid",
					as: "comments",
					fieldJson: { _id: true },
				}
			]
		});
		return res;
	}

}
