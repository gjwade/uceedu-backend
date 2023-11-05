<template>
	<view class="page-body">
		<el-collapse v-model="activeNames">
			<el-collapse-item title="内部可跳转地址及参数一览" name="1">
				<div class="doc-item">
					<h2>课程</h2>
					<div>
						<h3>链接</h3>
						<p>/uni_modules/uce-course/pages/list/list</p>
						<h3>参数</h3>
						<p><el-tag size="mini">scene</el-tag>可选，'default'：全部、'rec'：推荐、'free'：免费</p>
						<p><el-tag size="mini">cid</el-tag>可选,课程分类ID</p>
						<h3>示例</h3>
						<p>/uni_modules/uce-course/pages/list/list?scene=rec&cid=10086</p>
					</div>
				</div>
			</el-collapse-item>
		</el-collapse>
	</view>
</template>

<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	export default {
		data() {
			// 页面数据变量
			return {
				// init请求返回的数据
				data: {
					activeNames: ['1']
				},
				// 表单请求数据
				form1: {

				}
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
			// 页面数据初始化函数
			init(options) {

			},
			// 页面跳转
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
	.page-body {}
	.doc-item{
		h2{
			margin-bottom: 10px;
		}
		h3{
			margin-bottom: 5px;
		}
		p{
			margin-bottom: 5px;
			-webkit-user-select: text;
		}
	}
</style>
