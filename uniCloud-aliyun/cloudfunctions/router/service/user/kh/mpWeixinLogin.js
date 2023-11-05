'use strict';
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
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let mpWeixin = pubFun.getVKConfig()['vk']['oauth']['mp-weixin']

		let requestRes = await vk.request({
			url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + mpWeixin.appid +
				'&secret=' +
				mpWeixin.appsecret + '&code=' + data.code + '&grant_type=authorization_code',
		});
		
		console.log(requestRes)

		// request.get({
		// 		url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + AppID + '&secret=' +
		// 			AppSecret + '&code=' + code + '&grant_type=authorization_code'
		// 	},
		// 	function(error, response, body) {
		// 		if (response.statusCode == 200) {
		// 			let data = JSON.parse(body)
		// 			let access_token = data.access_token;
		// 			let openid = data.openid;
		// 			request.get({
		// 					url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token +
		// 						'&openid=' + openid + '&lang=zh_CN'
		// 				},
		// 				function(error, response, body) {
		// 					var userinfo = JSON.parse(body);
		// 					console.log(userinfo)
		// 					res.send("\
		//                           <h1>" + userinfo.nickname + " 的个人信息</h1>\
		//                           <p><img src='" + userinfo.headimgurl + "' /></p>\
		//                           <p>" + userinfo.city + "，" + userinfo.province + "，" + userinfo.country + "</p>\
		//                       ");
		// 				}
		// 			)
		// 		}
		// 	}
		// )


		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
