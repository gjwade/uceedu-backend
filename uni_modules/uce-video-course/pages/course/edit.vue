<template>
	<view class="page-body">
		<el-row :gutter="15">
			<el-form ref="form1" :model="form1" :rules="rules" size="medium" label-width="100px">
				<el-col :span="16">
					<el-form-item label="课程标题" prop="title">
						<el-input v-model="form1.title" placeholder="请输入课程标题" clearable :style="{width: '100%'}">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="课程分类" prop="category_id">
						<vk-data-input-remote-select v-model="form1.category_id" placeholder="请选择课程分类"
							action="admin/video_course/category/sys/categories"
							:props="{ list: 'rows', value: '_id', label: 'name' }" width="100%" show-all>
						</vk-data-input-remote-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="课程封面" prop="thumb" required>
						<vk-data-input-file-select v-model="form1.thumb" placeholder="请选择图片" file-type="image">
						</vk-data-input-file-select>
						<!-- <vk-data-upload v-model="form1.thumb" :limit="1"></vk-data-upload> -->
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="课程售价" prop="charge">
						<vk-data-input-money v-model="form1.charge" placeholder="请输入课程售价" :rightText="'元'" width="100%">
						</vk-data-input-money>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="课程原价" prop="charge_original">
						<vk-data-input-money v-model="form1.charge_original" placeholder="请输入课程原价" :rightText="'元'"
							width="100%">
						</vk-data-input-money>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="上架时间" prop="published_at">
						<el-date-picker type="datetime" v-model="form1.published_at" format="yyyy-MM-dd HH:mm:ss"
							value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" placeholder="请选择上架时间" clearable>
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="课程状态" prop="is_show">
						<el-select v-model="form1.is_show" placeholder="请选择课程状态" clearable :style="{width: '100%'}">
							<el-option v-for="(item, index) in is_showOptions" :key="index" :label="item.label"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="是否推荐" prop="is_rec">
						<el-select v-model="form1.is_rec" placeholder="请选择是否推荐" clearable :style="{width: '100%'}">
							<el-option v-for="(item, index) in is_recOptions" :key="index" :label="item.label"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="评论开关" prop="comment_status">
						<el-select v-model="form1.comment_status" placeholder="请选择评论开关" clearable
							:style="{width: '100%'}">
							<el-option v-for="(item, index) in comment_statusOptions" :key="index" :label="item.label"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="课程简介" prop="short_description">
						<el-input v-model="form1.short_description" type="textarea" placeholder="请输入课程简介"
							:autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="详细介绍" prop="render_desc">
						<vk-data-input-editor v-model="form1.render_desc" placeholder="请输入详细介绍" width="100%">
						</vk-data-input-editor>
					</el-form-item>
				</el-col>
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
					thumb: null,
					charge: undefined,
					charge_original: 0,
					published_at: null,
					is_show: 1,
					is_rec: 0,
					comment_status: 1,
					short_description: undefined,
					render_desc: null,
				},
				rules: {
					title: [{
						required: true,
						message: '请输入课程标题',
						trigger: 'blur'
					}],
					charge: [{
						required: true,
						message: '请输入课程售价',
						trigger: 'blur'
					}],
					charge_original: [],
					published_at: [{
						required: true,
						message: '请选择上架时间',
						trigger: 'change'
					}],
					is_show: [{
						required: true,
						message: '请选择课程状态',
						trigger: 'change'
					}],
					is_rec: [{
						required: true,
						message: '请选择是否推荐',
						trigger: 'change'
					}],
					comment_status: [{
						required: true,
						message: '请选择评论开关',
						trigger: 'change'
					}],
					short_description: [{
						required: true,
						message: '请输入课程简介',
						trigger: 'blur'
					}],
					render_desc: [{
						required: true,
						message: '请输入详细介绍',
						trigger: 'blur'
					}],
				},
				is_showOptions: [{
					"label": "显示",
					"value": 1
				}, {
					"label": "隐藏",
					"value": 0
				}],
				is_recOptions: [{
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
