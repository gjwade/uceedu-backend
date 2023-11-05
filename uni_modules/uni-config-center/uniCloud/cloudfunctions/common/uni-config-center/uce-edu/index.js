module.exports = {
	"app_name": "UCE知识付费平台",
	//开启应用 主要控制首页显示内容 论坛、题库这种暂时不控制
	"application": {
		"course": true,//点播课功能
		"article": true,//新闻资讯功能
		"pay-article": true,//付费图文功能
		"free-live-course": true,//公开课
	},
	//首页导航图标配置 超出列*行个数后会自动分页
	"home_nav": {
		"nav_column": 5, //列
		"nav_row": 1, //行
	}
}
