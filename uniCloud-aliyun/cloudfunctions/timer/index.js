'use strict';
exports.main = async (event, context) => {
	let res = { code: 0, msg: "" };
	res.callFunctionResult = await uniCloud.callFunction({
		name: "router",
		data: {
			// 需要执行的云函数路径
			$url: "admin/time_task/pub/auto_cancel_order"
		}
	});
	console.log(res.callFunctionResult)
	return res;
};
