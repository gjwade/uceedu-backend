<template>
	<view class="page-body">
		<el-row :gutter="15">
			<el-form ref="form1" :model="form1" :rules="rules" size="medium" label-width="100px">
				<el-col :span="16">
					<el-form-item label="更新标题" prop="title">
						<el-input v-model="form1.title" placeholder="请输入更新标题" clearable :style="{width: '100%'}">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="应用名称" prop="appid">
						<vk-data-input-remote-select v-model="form1.appid" placeholder="请选择应用"
							action="admin/upgrade_center/sys/categories"
							:props="{ list: 'rows', value: 'appid', label: 'name' }" width="100%" show-all>
						</vk-data-input-remote-select>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="更新内容" prop="contents">
						<el-input v-model="form1.contents" type="textarea" placeholder="请输入更新内容"
							:autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="包类型" prop="type">
						<el-select v-model="form1.type" placeholder="请选择包类型" clearable :style="{width: '100%'}">
							<el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="16" v-if="form1.type=='wgt'">
					<el-form-item label="平台" prop="platform">
						<vk-data-input-checkbox v-model="form1.platform" :localdata="platformOptions">
						</vk-data-input-checkbox>
					</el-form-item>
				</el-col>
				<el-col :span="16" v-else>
					<el-form-item label="平台" prop="platform">
						<vk-data-input-radio v-model="form1.platform" :localdata="platformOptions">
						</vk-data-input-radio>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="版本号" prop="version">
						<el-input v-model="form1.version" placeholder="请输入版本号,如 1.0.1" clearable
							:style="{width: '100%'}">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item v-if="form1.type=='wgt'" label="最低版本" prop="min_uni_version">
						<el-input v-model="form1.min_uni_version" placeholder="请输入原生App最低版本" clearable
							:style="{width: '100%'}">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="包地址" prop="url">
						<el-input v-model="form1.url" placeholder="请输入可下载安装包地址,IOS完整升级包请填写AppStore地址" clearable
							:style="{width: '100%'}">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="form1.type=='wgt'">
					<el-form-item label="静默更新" prop="is_silently">
						<el-switch v-model="form1.is_silently" :active-value="true" :inactive-value="false"></el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="强制更新" prop="is_mandatory">
						<el-switch v-model="form1.is_mandatory" :active-value="true" :inactive-value="false">
						</el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="上线发行" prop="stable_publish">
						<el-switch v-model="form1.stable_publish" :active-value="true" :inactive-value="false">
						</el-switch>
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
					"appid": "",
					"name": "",
					"title": "",
					"contents": "",
					"platform": [],
					"type": "wgt",
					"version": "",
					"min_uni_version": "",
					"url": "",
					"is_silently": "",
					"is_mandatory": "",
					"stable_publish": false,
				},
				rules: {
					title: [{
						required: true,
						message: '请输入升级标题',
						trigger: 'blur'
					}],
					appid: [{
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
					contents: [{
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
					platform: [{
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
					version: [{
						required: true,
						message: '请输入',
						trigger: 'blur'
					}],
					url: [{
						required: true,
						message: '请输入',
						trigger: 'blur'
					}]
				},
				typeOptions: [{
					"label": "原生App安装包-native_app",
					"value": "native_app"
				}, {
					"label": "App资源包-wgt",
					"value": "wgt"
				}],
				platformOptions: [{
					"label": "安卓",
					"value": "Android"
				}, {
					"label": "苹果",
					"value": "iOS"
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
