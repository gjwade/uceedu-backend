<template>
	<view class="page-body">
		<!-- 页面内容开始 -->
		<view class="el_top_row1">
			<view class="el_row_item">
				<view class="item_title">今日收入</view>
				<view class="item_text">{{baseData.t_d_money/100}}</view>
				<view class="item_info">
					<view class="info_item">
						昨天收入：{{baseData.y_d_money/100}}
					</view>
					<view class="info_item">
						较昨日：<text class="bold">{{huanBi(baseData.t_d_money,baseData.y_d_money)}}%</text>
					</view>
				</view>
			</view>
			<view class="el_row_item">
				<view class="item_title">今日付费订单</view>
				<view class="item_text">{{baseData.t_d_count}}</view>
				<view class="item_info">
					<view class="info_item">
						昨天付费订单：{{baseData.y_d_count}}
					</view>
					<view class="info_item">
						较昨日：<text class="bold">{{huanBi(baseData.t_d_count,baseData.y_d_count)}}%</text>
					</view>
				</view>
			</view>
			<view class="el_row_item2">
				<view class="el_item">
					<view class="text">总用户</view>
					<view class="text el_item_num">{{baseData.total_user}}</view>
					<view class="text el_item_increase">今日新增：<text class="bold">{{baseData.t_d_user}}</text></view>
				</view>
				<view class="el_item">
					<view class="text">本月总收益</view>
					<view class="text el_item_num">{{baseData.t_m_money}}</view>
					<view class="text el_item_increase">较上月：<text
							class="bold">{{huanBi(baseData.t_m_money,baseData.p_m_money)}}%</text>
					</view>
				</view>
			</view>
		</view>
		<view class="el_top_row3">
			<view class="title">
				统计分析
			</view>
			<view class="selcharttimebox">
				<el-button @click="getChartData('c1')" :type="currentChart=='c1'?'primary':'default'">新注册用户</el-button>
				<el-button @click="getChartData('c2')" :type="currentChart=='c2'?'primary':'default'">每日新增订单量
				</el-button>
				<el-button @click="getChartData('c3')" :type="currentChart=='c3'?'primary':'default'">每日支付订单量
				</el-button>
				<el-button @click="getChartData('c4')" :type="currentChart=='c4'?'primary':'default'">每日支付订单总额
				</el-button>
			</view>
			<view class="time-filter">
				<vk-data-input-date-time v-model="daterange" type="daterange"></vk-data-input-date-time>
				<el-button type="primary" plain style="margin-left: 20px;">过滤</el-button>
			</view>

			<view class="charts-box">
				<qiun-data-charts type="line" :chartData="chartData" background="none" />
			</view>
		</view>
		<!-- 页面内容结束 -->
	</view>
</template>

<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例

	export default {
		data() {
			// 页面数据变量
			return {
				currentChart: "c1",
				daterange: null,
				baseData: {
					p_m_money: 0,
					t_d_count: 0,
					t_d_money: 0,
					t_d_user: 0,
					t_m_money: 0,
					total_user: 0,
					y_d_count: 0,
					y_d_money: 0,
				},
				chartData: {
					categories: [],
					series: [],
				},
			}
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			that = this;
			vk = that.vk;
			that.options = options;
			that.init(options);
		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady() {

		},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {


		},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {


		},
		// 函数
		methods: {
			//计算环比
			huanBi(t, p) {
				if (p == 0)
					return "+100"
				let res = Number((t - p) / p * 100).toFixed(0)
				if (res > 0)
					return "+" + res
				return "" + res
			},
			// 页面数据初始化函数
			init(options) {
				vk.callFunction({
					url: 'admin/index/sys/base_data',
					data: {},
					success(data) {
						that.baseData = data.data
					}
				});
				this.setChartData()
			},
			getChartData(type = 'c1') {
				this.currentChart = type
			},
			setChartData() {
				this.chartData = {
					"categories": [
						"2016",
						"2017",
						"2018",
						"2019",
						"2020",
						"2021"
					],
					"series": [{
							"name": "成交量A",
							"data": [
								35,
								8,
								25,
								37,
								4,
								20
							]
						},
						{
							"name": "成交量B",
							"data": [
								70,
								40,
								65,
								100,
								44,
								68
							]
						},
						{
							"name": "成交量C",
							"data": [
								100,
								80,
								95,
								150,
								112,
								132
							]
						}
					]
				}
			},
			pageTo(path) {
				vk.navigateTo(path);
			}
		},
		// 过滤器
		filters: {

		},
		// 计算属性
		computed: {

		}
	}
</script>
<style lang="scss" scoped>
	page {
		background: rgba(0, 0, 0, 0);
		padding: 0 !important;
	}

	.page-body {
		padding: 0 !important;
	}

	.el_top_row1 {
		width: 100%;
		height: 204px !important;
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.el_row_item {
		width: 32.5%;
		height: 204px !important;
		overflow: hidden;
		background: #fff;
		border-radius: 8px;
		margin-right: 20px;
		padding: 20px;
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
		background: #FFFFFF;

		.item_title {
			width: 100%;
			padding-left: 10px;
			height: 16px;
			font-size: 16px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666;
			margin-bottom: 40px;
			line-height: 16px;
		}

		.item_text {
			width: 100%;
			padding-left: 10px;
			height: 36px;
			font-size: 36px;
			font-weight: 600;
			color: #333;
			line-height: 36px;
		}

		.item_info {
			margin-top: 30px;
			width: 100%;
			min-height: 42px;
			background: #f1f2f9;
			padding: 10px;
			box-sizing: border-box;
			overflow: hidden;
			display: flex;
			flex-direction: row;

			.info_item {
				width: 50%;
				height: 22px;
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666;
				line-height: 22px;

				.bold {
					font-weight: bold;
					color: #3a62d7;
				}
			}
		}
	}

	.el_row_item2 {
		width: calc(35% - 40px);
		height: 204px !important;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.el_item {
			width: 100%;
			height: 92px;
			background: #fff;
			border-radius: 8px;
			padding-left: 30px;
			padding-right: 30px;
			overflow: hidden;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			align-items: center;

			.text {
				width: 110px;
				display: block;
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666;
				line-height: 16px;
			}

			.el_item_num {
				width: auto;
				font-size: 36px;
				font-weight: 600;
				color: #333;
				line-height: 36px;
				text-align: left;
			}

			.el_item_increase {
				width: 42%;
				margin-left: auto;

				.bold {
					font-weight: bold;
					color: #3a62d7;
				}
			}
		}
	}

	.el_top_row3 {
		width: 100%;
		height: 558px;
		background: #fff;
		border-radius: 8px;
		margin-top: 20px;
		padding: 76px 30px 0 30px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		position: relative;

		.title {
			position: absolute;
			height: 16px;
			font-size: 16px;
			font-weight: 600;
			color: #333;
			line-height: 16px;
			top: 30px;
			left: 30px;
		}

		.selcharttimebox {
			width: 100%;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			overflow: hidden;
		}

		.time-filter {
			margin-top: 20px;
		}

		.charts-box {
			position: relative;
			width: 100%;
			height: 300px;
			margin-top: 20px;
		}
	}
</style>
