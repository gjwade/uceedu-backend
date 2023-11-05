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
			aid,
			cid
		} = data;

		//文章作者采取该篇文章下的答案

		let num = await vk.baseDao.update({
			dbName: "bbs_article",
			whereJson: {
				uid: uid,
				_id: aid
			},
			dataJson: {
				bbs_status: 2
			}
		});

		if (num < 1) {
			res = { code: -1, msg: '无权限' }
			return res
		}

		num = await vk.baseDao.update({
			dbName: "bbs_comments",
			whereJson: {
				_id: cid,
				aid: aid
			},
			dataJson: {
				comment_status: 2
			}
		});
		
		if (num < 1) {
			res = { code: -1, msg: '无权限' }
			return res
		}

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
