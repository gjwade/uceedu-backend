module.exports = {
	/**
	 * 数据删除
	 * @url admin/kong/sys/delete 前端调用的url参数地址
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
		let { _id } = data;
		if (vk.pubfn.isNull(_id)) {
			return { code: -1, msg: 'id不能为空' };
		}

		//同步删除课程下 章节 以及视频
		const transaction = await vk.baseDao.startTransaction();
		try {
			//删视频
			await vk.baseDao.deleteById({
				dbName: "questions",
				bank_id: _id
			});

			//删章节
			await vk.baseDao.deleteById({
				dbName: "q_bank_chapter",
				bank_id: _id
			});

			//删课程
			let dbName = "q_bank";
			await vk.baseDao.deleteById({
				dbName,
				id: _id
			});

			// 提交事物
			await transaction.commit();
		} catch (err) {
			// 事务回滚
			await transaction.rollback();
			console.error(`transaction error`, err)
			return {
				code: -1,
				msg: "数据库写入异常,事务已回滚",
				err: {
					message: err.message,
					stack: err.stack
				}
			}
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}

}
