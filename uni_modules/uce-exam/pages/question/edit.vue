<template>
	<view class="page-body">
		<el-row :gutter="15">
			<el-form ref="form1" :model="form1" :rules="rules" size="medium" label-width="100px">
				<el-col :span="8">
					<el-form-item label="类型" prop="type">
						<el-select @change="handleTypeChange" v-model="form1.type" placeholder="请选择题目类型" clearable
							:style="{width: '100%'}">
							<el-option v-for="(item, index) in types" :key="index" :label="item.title"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="难度" prop="level">
						<el-select v-model="form1.level" placeholder="请选择题目难度" clearable :style="{width: '100%'}">
							<el-option v-for="(item, index) in levels" :key="index" :label="item.title"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="分值" prop="score">
						<el-input v-model="form1.score" placeholder="请输入题目分值" clearable :style="{width: '100%'}">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="所属章节" prop="chapter_id">
						<el-select v-model="form1.chapter_id" placeholder="请选择章节" clearable :style="{width: '100%'}">
							<el-option v-for="(item, index) in chapterList" :key="index" :label="item.title"
								:value="item._id"></el-option>
						</el-select>
					</el-form-item>
				</el-col>


				<el-col :span="24">
					<el-form-item label="题干" prop="title">
						<vk-data-input-editor v-model="form1.title" placeholder="请输入题干" width="100%">
						</vk-data-input-editor>
					</el-form-item>
				</el-col>

				<el-col :span="24">
					<el-form-item label="整题解析" prop="analysis">
						<vk-data-input-editor v-model="form1.analysis" placeholder="请输入解析" width="100%">
						</vk-data-input-editor>
					</el-form-item>
				</el-col>

				<view class="filter-container" style="margin-top: 25px" v-if="form1.type!=4">

					<el-button class="filter-item" type="primary" icon="el-icon-plus" size="small" plain
						@click="handleAdd">
						添加
					</el-button>

					<el-table :data="form1.answerList" :border="true" style="width: 100%;margin: 20px 0;">
						<el-table-column label="是否答案" width="120" align="center" v-if="form1.type!='5'">
							<template slot-scope="scope">

								<el-checkbox v-model="scope.row.isRight">答案</el-checkbox>

							</template>

						</el-table-column>

						<el-table-column label="答案内容">
							<template slot-scope="scope">
								<el-input v-model="scope.row.content" type="textarea" />
							</template>
						</el-table-column>

						<el-table-column label="答案解析">
							<template slot-scope="scope">
								<el-input v-model="scope.row.analysis" type="textarea" />
							</template>
						</el-table-column>

						<el-table-column label="操作" align="center" width="100px">
							<template slot-scope="scope">
								<el-button type="danger" icon="el-icon-delete" circle
									@click="removeItem(scope.$index)" />
							</template>
						</el-table-column>

					</el-table>

				</view>

				<el-col :span="24">
					<el-form-item size="large">
						<el-button type="primary" @click="submitForm">提交</el-button>
						<el-button @click="resetForm">重置</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-row>
		<aliyun-vod-upload ref="aliyunVodUpload" @success="aliyunVodUploadSuccess"></aliyun-vod-upload>
	</view>
</template>
<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例
	export default {
		props: ['action', 'form-type', 'item', 'cid'],
		components: {},
		data() {
			return {
				chapterList: [],
				form1: {
					bank_id: undefined,
					chapter_id: undefined,
					type: undefined,
					level: undefined,
					score: undefined,
					title: undefined,
					analysis: undefined,
					answerList: undefined
				},
				rules: {
					title: [{
						required: true,
						message: '请输入题干',
						trigger: 'blur'
					}],
					bank_id: [{
						required: true,
						message: '未关联题库',
						trigger: 'blur'
					}],
					chapter_id: [{
						required: true,
						message: '请选择所属章节',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请选择类型',
						trigger: 'change'
					}],
					level: [{
						required: true,
						message: '请选择难度',
						trigger: 'change'
					}],
					score: [{
						required: true,
						message: '请输入分值',
						trigger: 'blur'
					}]
				},
				types: [{
						title: '单选题',
						value: '1',
					},
					{
						title: '多选题',
						value: '2',
					},
					{
						title: '判断题',
						value: '3',
					},
					{
						title: '问答题',
						value: '4',
					},
					{
						title: '填空题',
						value: '5',
					}
				],
				levels: [{
						title: '简单',
						value: '简单',
					},
					{
						title: '中等',
						value: '中等',
					},
					{
						title: '难',
						value: '难',
					},
					{
						title: '特别难',
						value: '特别难',
					}
				],
			}
		},
		//监听-页面每次【加载时】执行(如:前进)
		onLoad(options = {}) {},
		created() {
			that = this;
			vk = that.vk;
			this.form1.bank_id = this.cid
			that.getChapters()
			if (this.formType == "update") {
				this.form1 = this.item
			}
		},
		mounted() {},
		methods: {
			handleTypeChange(v) {
				this.form1.answerList = []
				if (v == 3) {
					this.form1.answerList.push({ isRight: true, content: '正确', analysis: '' })
					this.form1.answerList.push({ isRight: false, content: '错误', analysis: '' })
				}

				if (v == 1 || v == 2) {
					this.form1.answerList.push({ isRight: false, content: '', analysis: '' })
					this.form1.answerList.push({ isRight: false, content: '', analysis: '' })
					this.form1.answerList.push({ isRight: false, content: '', analysis: '' })
					this.form1.answerList.push({ isRight: false, content: '', analysis: '' })
				}
			},

			// 添加子项
			handleAdd() {
				this.form1.answerList.push({ isRight: false, content: '', analysis: '' })
			},

			removeItem(index) {
				this.form1.answerList.splice(index, 1)
			},
			getChapters() {
				vk.callFunction({
					url: 'admin/q_bank/bank_chapter/sys/chapters',
					data: {
						cid: that.form1.bank_id
					},
					success(data) {
						that.chapterList = data.rows
					}
				});
			},
			//页面数据初始化函数
			init(options) {},
			submitForm() {
				let rightCount = 0

				this.form1.answerList.forEach(function(item) {
					if (item.isRight) {
						rightCount += 1
					}
				})

				if (this.form1.type === 1) {
					if (rightCount !== 1) {
						this.$message({
							message: '单选题答案只能有一个',
							type: 'warning'
						})

						return
					}
				}

				if (this.form1.type === 2) {
					if (rightCount < 2) {
						this.$message({
							message: '多选题至少要有两个正确答案！',
							type: 'warning'
						})

						return
					}
				}

				if (this.form1.type === 3) {
					if (rightCount !== 1) {
						this.$message({
							message: '判断题只能有一个正确项！',
							type: 'warning'
						})

						return
					}
				}

				this.submitFormAction()
			},
			submitFormAction() {
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
