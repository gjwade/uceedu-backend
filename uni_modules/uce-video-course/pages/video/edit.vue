<template>
	<view class="page-body">
		<el-row :gutter="15">
			<el-form ref="form1" :model="form1" :rules="rules" size="medium" label-width="100px">
				<el-col :span="16">
					<el-form-item label="视频标题" prop="title">
						<el-input v-model="form1.title" placeholder="请输入课程标题" clearable :style="{width: '100%'}">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="所属章节" prop="chapter_id">
						<!-- 		<vk-data-input-remote-select v-model="form1.chapter_id" placeholder="请选择视频章节"
							:action="'admin/video_course/chapter/sys/chapters'" :actionData="{cid:form1.course_id}"
							:props="{ list: 'rows', value: '_id', label: 'title' }" width="100%" show-all>
						</vk-data-input-remote-select> -->

						<el-select v-model="form1.chapter_id" placeholder="请选择视频章节" clearable :style="{width: '100%'}">
							<el-option v-for="(item, index) in chapterList" :key="index" :label="item.title"
								:value="item._id"></el-option>
						</el-select>
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
					<el-form-item label="上架时间" prop="published_at">
						<el-date-picker type="datetime" v-model="form1.published_at" format="yyyy-MM-dd HH:mm:ss"
							value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" placeholder="请选择上架时间" clearable>
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="禁止快进" prop="ban_drag">
						<el-switch v-model="form1.ban_drag" :active-value="true" :inactive-value="false"></el-switch>
					</el-form-item>
				</el-col>
				<!-- <el-col :span="8">
					<el-form-item label="评论开关" prop="comment_status">
						<el-select v-model="form1.comment_status" placeholder="请选择评论开关" clearable
							:style="{width: '100%'}">
							<el-option v-for="(item, index) in comment_statusOptions" :key="index" :label="item.label"
								:value="item.value" :disabled="item.disabled"></el-option>
						</el-select>
					</el-form-item>
				</el-col> -->


				<el-col :span="12">
					<el-form-item label="视频时长" prop="duration">
						<secondTimeInput v-model="form1.duration"></secondTimeInput>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="试看时长" prop="free_seconds">
						<secondTimeInput v-model="form1.free_seconds"></secondTimeInput>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="上传视频" prop="use_type">
						<el-radio-group v-model="form1.use_type" style="margin-bottom: 30px;">
							<el-radio-button label="url">直连</el-radio-button>
							<el-radio-button label="aliyun_video_id">阿里云点播</el-radio-button>
						</el-radio-group>

						<el-row :gutter="0" v-if="form1.use_type=='url'">
							<el-col :span="20">
								<el-input v-model="form1.url" placeholder="直接输入直连地址或者点击右侧上传按钮"></el-input>
							</el-col>
							<el-col :span="4">
								<vk-data-upload v-model="form1.url" :limit="1" upload-type="file" list-type="text"
									:accept="'mp4'" :provider="fileProvider">
								</vk-data-upload>
							</el-col>
						</el-row>

						<el-row :gutter="0" v-if="form1.use_type=='aliyun_video_id'">
							<el-col :span="20">
								<el-input v-model="form1.aliyun_video_id" placeholder="点击右侧上传或直接输入文件fileid"></el-input>
							</el-col>
							<el-col :span="4">
								<el-button @click.prevent="uploadAliyunVideo()">上传视频<i
										class="el-icon-upload el-icon--right"></i></el-button>
							</el-col>
						</el-row>
					</el-form-item>
					<!-- <el-form-item label=" " prop="url" v-if="form1.use_type=='url'">
						<el-input v-model="form1.url"></el-input>
						<el-button @click.prevent="uploadVideo()">上传</el-button>
					</el-form-item>

					<el-form-item label=" " prop="aliyun_video_id" v-if="form1.use_type=='aliyun_video_id'">
						<el-input v-model="form1.aliyun_video_id"></el-input>
						<el-button @click.prevent="uploadAliyunVideo()">上传</el-button>
					</el-form-item> -->
				</el-col>
				<el-col :span="24">
					<el-form-item label="视频简介" prop="short_description">
						<el-input v-model="form1.short_description" type="textarea" placeholder="请输入视频简介"
							:autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="介绍/讲义" prop="render_desc">
						<vk-data-input-editor v-model="form1.render_desc" placeholder="请输入详细介绍/讲义" width="undefined">
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
					title: undefined,
					course_id: undefined,
					chapter_id: undefined,
					published_at: null,
					is_show: 1,
					ban_drag: false,
					comment_status: 1,
					short_description: undefined,
					render_desc: null,
					free_seconds: 0,
					duration: 0,
					use_type: "url",
					url: "",
					aliyun_video_id: ""
				},
				rules: {
					title: [{
						required: true,
						message: '请输入课程标题',
						trigger: 'blur'
					}],
					course_id: [{
						required: true,
						message: '未关联课程',
						trigger: 'blur'
					}],
					chapter_id: [{
						required: true,
						message: '请选择所属章节',
						trigger: 'blur'
					}],
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
					ban_drag: [{
						required: true,
						message: '请选择是否允许快进',
						trigger: 'change'
					}],
					duration: [{
						required: true,
						message: '请填写视频时长',
						trigger: 'change'
					}],
					use_type: [{
						required: true,
						message: '请上传视频',
						trigger: 'change'
					}],
					short_description: [{
						required: false,
						message: '请输入视频简介',
						trigger: 'blur'
					}],
					render_desc: [{
						required: false,
						message: '请输入视频描述/讲义',
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
			this.form1.course_id = this.cid
			that.getChapters()
			if (this.formType == "update") {
				this.form1 = this.item
			}
		},
		mounted() {},
		methods: {
			//阿里云点播上传成功
			aliyunVodUploadSuccess(uoloadInfo) {
				this.form1.aliyun_video_id = uoloadInfo.videoId
			},
			uploadVideo() {},
			uploadAliyunVideo() {
				this.$refs.aliyunVodUpload.chooseVideo(this.form1.title)
			},
			getChapters() {
				vk.callFunction({
					url: 'admin/video_course/chapter/sys/chapters',
					data: {
						cid: that.form1.course_id
					},
					success(data) {
						that.chapterList = data.rows
					}
				});
			},
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
