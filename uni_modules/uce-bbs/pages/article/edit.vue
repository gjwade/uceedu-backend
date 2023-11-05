<template>
	<view class="page-body">
		<el-row :gutter="15">
			<el-form ref="form1" :model="form1" :rules="rules" size="medium" label-width="100px">
				<el-col :span="16">
					<el-form-item label="文章标题" prop="title">
						<el-input v-model="form1.title" placeholder="请输入课程标题" clearable :style="{width: '100%'}">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="文章分类" prop="category_id">
						<vk-data-input-remote-select v-model="form1.category_id" placeholder="请选择文章分类"
							action="admin/articles/category/sys/categories"
							:props="{ list: 'rows', value: '_id', label: 'name' }" width="100%" show-all>
						</vk-data-input-remote-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="是否推荐" prop="is_essence">
						<el-select v-model="form1.is_essence" placeholder="请选择是否推荐" clearable :style="{width: '100%'}">
							<el-option v-for="(item, index) in isEssenceOptions" :key="index" :label="item.label"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="是否置顶" prop="is_sticky">
						<el-select v-model="form1.is_sticky" placeholder="请选择是否置顶" clearable :style="{width: '100%'}">
							<el-option v-for="(item, index) in isStickyOptions" :key="index" :label="item.label"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="发布时间" prop="publish_date">
						<el-date-picker type="datetime" v-model="form1.publish_date" format="yyyy-MM-dd HH:mm:ss"
							value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" placeholder="请选择发布时间" clearable>
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="文章封面" prop="avatar" required>
						<vk-data-input-file-select v-model="form1.avatar" placeholder="请选择图片" file-type="image">
						</vk-data-input-file-select>
						<!-- <vk-data-upload v-model="form1.thumb" :limit="1"></vk-data-upload> -->
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="文章摘要" prop="excerpt">
						<el-input v-model="form1.excerpt" type="textarea" placeholder="请输入文章摘要"
							:autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="文章内容" prop="content">
						<vk-data-input-editor v-model="form1.content" placeholder="请输入文章内容" width="100%">
						</vk-data-input-editor>
					</el-form-item>
				</el-col>

				<!-- 
				<el-col :span="8">
					<el-form-item label="评论开关" prop="comment_status">
						<el-select v-model="form1.comment_status" placeholder="请选择评论开关" clearable
							:style="{width: '100%'}">
							<el-option v-for="(item, index) in comment_statusOptions" :key="index" :label="item.label"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col> -->


				<el-col :span="24">
					<el-form-item size="large">
						<el-button type="primary" @click="submitForm">提交</el-button>
						<el-button @click="resetForm">重置</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-row>
	</view>
</template>
<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	export default {
		props: ['action', 'form-type', 'item'],
		components: {},
		data() {
			return {
				form1: {
					title: undefined,
					category_id: undefined,
					avatar: null,
					excerpt: null,
					content: null,
					publish_date: null,
					is_sticky: 0,
					is_essence: 0,
				},
				rules: {
					title: [{
						required: true,
						message: '请输入课程标题',
						trigger: 'blur'
					}],
					excerpt: [{
						required: true,
						message: '请输入文章摘要',
						trigger: 'blur'
					}],
					publish_date: [{
						required: true,
						message: '请选择发布时间',
						trigger: 'change'
					}],
					category_id: [{
						required: true,
						message: '请选择文章分类',
						trigger: 'change'
					}]
				},
				isStickyOptions: [{
					"label": "是",
					"value": 1
				}, {
					"label": "否",
					"value": 0
				}],
				isEssenceOptions: [{
					"label": "是",
					"value": 1
				}, {
					"label": "否",
					"value": 0
				}],
				comment_statusOptions: [{
					"label": "关闭评论",
					"value": 0
				}, {
					"label": "所有人",
					"value": 1
				}, {
					"label": "仅购买",
					"value": 2
				}],
			}
		},
		//监听-页面每次【加载时】执行(如:前进)
		onLoad(options = {}) {},
		created() {
			that = this;
			vk = that.vk;
			if (this.formType == "update") {
				this.form1 = this.item
			}
		},
		mounted() {},
		methods: {
			//页面数据初始化函数
			init(options) {},
			submitForm() {
				this.$refs['form1'].validate(valid => {
					if (!valid) return
					vk.callFunction({
						url: this.action,
						title: '提交中...',
						data: this.form1,
						success(data) {
							that.$emit("success")
						}
					});
				})
			},
			resetForm() {
				this.$refs['form1'].resetFields()
			}
		},
		// 监听器
		watch: {},
		// 过滤器
		filters: {},
		// 计算属性
		computed: {},
	}
</script>
<style lang="scss" scoped>
	.el-upload__tip {
		line-height: 1.2;
	}

	.page-body {
		max-width: 1200px !important;
		margin: 0 auto;
	}
</style>
