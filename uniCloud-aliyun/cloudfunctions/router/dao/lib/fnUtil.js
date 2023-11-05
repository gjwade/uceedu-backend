/**
 * 工具包
 * 请勿修改此处代码，因为插件更新后此处代码会被覆盖。
 * 作者：VK
 */
var fnUtil = {};

/**
 * 产生指定位数的随机数(支持任意字符,默认纯数字)
 * @params	{Number} length 数据源
 * @params	{String} str 指定的字符串中随机范围
 */
fnUtil.random = function(length, str) {
	let s = "";
	let list = "0123456789";
	//abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
	if (str) list = str;
	for (let i = 0; i < length; i++) {
		let code = list[Math.floor(Math.random() * list.length)];
		s += code;
	}
	return s;
};

/**
 * 日期格式化
 * @params {Date || Number} date 需要格式化的时间
 */
fnUtil.timeFormat = function(time, fmt = 'yyyy-MM-dd hh:mm:ss', targetTimezone = 8) {
	try {
		if (!time) {
			return "";
		}
		// 其他更多是格式化有如下:
		// yyyy-MM-dd hh:mm:ss|yyyy年MM月dd日 hh时MM分等,可自定义组合
		let date;
		if (typeof time === "number") {
			if (time.toString().length == 10) time *= 1000;
			date = new Date(time);
		} else {
			date = time;
		}

		const dif = date.getTimezoneOffset();
		const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
		const east8time = date.getTime() + timeDif;

		date = new Date(east8time);
		let opt = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (let k in opt) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (opt[k]) : (("00" + opt[k]).substr(("" + opt[
						k])
					.length)));
			}
		}
		return fmt;
	} catch (err) {
		// 若格式错误,则原值显示
		return time;
	}
};


/**
 * request 请求库
 */
fnUtil.request = async function(obj = {}) {
	if (Object.prototype.toString.call(obj.content) === "[object object]") obj.content = JSON.stringify(obj
		.content);
	if (typeof obj.dataType === "undefined") obj.dataType = "json";
	// 当返回的是二进制时,需要设置dataType = default
	if (obj.dataType == "default" || obj.dataType === "") delete obj.dataType;
	if (obj.useContent) obj.content = JSON.stringify(obj.data);
	if (!obj.method) obj.method = "POST";
	if (typeof obj.headers === "undefined" && typeof obj.header !== "undefined") {
		obj.headers = obj.header;
	}
	let originalRes = await uniCloud.httpclient.request(obj.url, obj);
	if (!obj.needOriginalRes && originalRes && originalRes.data) {
		return originalRes.data;
	} else {
		return originalRes;
	}
};

module.exports = fnUtil;
