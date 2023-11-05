'use strict';
const businessState = require('../../../../application/service/businessState.js')
module.exports = {
	/**
	 * 此函数名称
	 * @url user/pub/test1 前端调用的url参数地址
	 * @description 此函数描述
	 * @params {Object} data 请求参数
	 * @params {String} uniIdToken 用户token
	 * @params {String} userInfo 当前登录用户信息（可信任，仅kh目录下的函数有此值）
	 * pub目录下请求参数需要带上 need_user_info = true
	 * @params {Object} util 公共工具包
	 * @params {Object} filterResponse 过滤器返回的数据
	 * @params {Object} originalParam 原始请求参数（包含了原始event和context）
	 * data 请求参数 说明
	 * @params {String} uid 当前登录用户id（可信任，仅kh目录下的函数有此值）
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 */
	main: async (event) => {
		//  注意: userInfo 和 uid 是可信任的，但默认只有kh目录下的函数才有此值
		let { data = {}, userInfo, util, originalParam } = event;
		let { customUtil, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = {
			code: 0,
			msg: '',
			data: {}
		};
		// 业务逻辑开始----------------------------------------------------------- 
		//课程主体
		res.data.courses = await vk.baseDao.findById({
			dbName: "course",
			id: data._id,
			whereJson: {
				is_show: 1,
				published_at: _.lte(pubFun.getNowTimeStr())
			}
		});

		//获取课程章节
		let chapters = await db.collection('course_chapter').where({
			course_id: data._id
		}).orderBy('sort', 'asc').get()

		res.data.chapters = chapters.data

		//获取视频列表
		const $ = _.aggregate
		res.data.videos = await db.collection('course_videos').aggregate().match({
			course_id: data._id,
			is_show: 1,
			published_at: _.lte(pubFun.getNowTimeStr())
		}).sort({
			'published_at': 1
		}).group({
			_id: '$chapter_id',
			data: $.push({
				_id: '$_id',
				duration: '$duration',
				title: '$title',
				free_seconds: '$free_seconds',
				view_num: '$view_num'
			})
		}).end()

		//获取用户课程购买情况
		res.data.has_buy = await businessState.hasBuyCourses(event, data._id, userInfo)

		//视频观看进度

		//分销奖励
		// let multi_level_share = await db.collection('multi_level_share').where({
		// 	goods_type: "COURSES",
		// 	status: 1,
		// 	goods_id: data._id
		// }).limit(1).get()

		// if (multi_level_share.data.length > 0)
		// 	res.data.multi_level_share = multi_level_share.data[0]
		// else
		// 	res.data.multi_level_share = null

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
