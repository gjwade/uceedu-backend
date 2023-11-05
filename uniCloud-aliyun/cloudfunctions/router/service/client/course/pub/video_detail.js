'use strict';
const businessState = require('../../../../application/service/businessState.js')
const aliyunVod = require('../../../../application/service/aliyunVod.js')
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
			msg: '',
			data: {}
		};
		// 业务逻辑开始-----------------------------------------------------------
		// 可写与数据库的交互逻辑等等

		//todo 判断用户是否已经购买课程
		let course_id = data.course_id
		let video_id = data.video_id

		console.log(userInfo)

		let has_buy = await businessState.hasBuyCourses(event, course_id, userInfo)

		//已购课程||该课程允许试看 返回视频链接信息 否则没有
		let video = res.data.video = await vk.baseDao.findById({
			dbName: "course_videos",
			id: video_id,
			whereJson: {
				course_id: course_id,
				is_show: 1
			}
		});

		let free = video.free_seconds > 0

		//不允许试看 隐藏资源地址
		if (free == 0) {
			video.aliyun_video_id = null
			video.qiniu_video_id = null
			video.tencent_video_id = null
			video.url = null
		}

		res.data.video = video
		res.data.has_buy = has_buy || free

		//解析阿里云 || 腾讯云
		if (has_buy || free) {
			if (video.use_type == 'aliyun_video_id') {
				try {
					let response = await aliyunVod.GetPlayInfo(video.aliyun_video_id)
					if (response.PlayInfoList && response.PlayInfoList.PlayInfo && response.PlayInfoList
						.PlayInfo
						.length > 0) {
						video.url = response.PlayInfoList.PlayInfo[0].PlayURL
					}
				} catch (e) {
					video.error = e
				}

			}

		}


		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
