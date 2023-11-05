<template>
	<view>
		<el-dialog title="上传面板" :visible.sync="dialogFormVisible" append-to-body :close-on-click-modal="false">
			<div class="upload">
				<span class="progress">{{statusText}}</span>
				<el-progress :text-inside="true" :stroke-width="24" :percentage="authProgress" status="success">
				</el-progress>
			</div>
		</el-dialog>
	</view>
</template>

<script>
	var that
	export default {
		name: "aliyun-vod-upload",
		data() {
			return {
				dialogFormVisible: false,
				timeout: '',
				partSize: '',
				parallel: '',
				retryCount: '',
				retryDuration: '',
				region: 'cn-shanghai',
				userId: '1303984639806000',
				file: null,
				authProgress: 0,
				uploadDisabled: true,
				resumeDisabled: true,
				pauseDisabled: true,
				uploader: null,
				statusText: '视频准备上传中...',
				title: ""
			};
		},
		created() {
			that = this
		},
		mounted() {
			uni.vk.callFunction({
				url: 'admin/common/sys/getAliyunUploadBaseInfo',
				data: {},
				success(data) {
					that.region = data.data
				}
			});
		},
		onLoad() {
			that = this
		},
		methods: {
			chooseVideo(title) {
				this.title = title
				uni.chooseVideo({
					extension: ["mp4", "AVI", "MP3"],
					success(res) {
						console.log(res)
						var Title = res.name
						var userData = '{"Vod":{}}'
						that.file = res.tempFile
						if (that.uploader) {
							this.uploader.stopUpload()
							that.authProgress = 0
							that.statusText = ""
						}
						that.uploader = that.createUploader()
						console.log(userData)
						that.uploader.addFile(res.tempFile, null, null, null, userData)
					}
				})
			},
			authUpload() {
				// 然后调用 startUpload 方法, 开始上传
				if (this.uploader !== null) {
					this.uploader.startUpload()
					this.uploadDisabled = true
					this.pauseDisabled = false
					this.dialogFormVisible = true
				}
			},
			// 暂停上传
			pauseUpload() {
				if (this.uploader !== null) {
					this.uploader.stopUpload()
					this.resumeDisabled = false
					this.pauseDisabled = true
				}
			},
			// 恢复上传
			resumeUpload() {
				if (this.uploader !== null) {
					this.uploader.startUpload()
					this.resumeDisabled = true
					this.pauseDisabled = false
				}
			},
			createUploader(type) {
				let self = this
				let uploader = new AliyunUpload.Vod({
					timeout: self.timeout || 60000,
					partSize: self.partSize || 1048576,
					parallel: self.parallel || 5,
					retryCount: self.retryCount || 3,
					retryDuration: self.retryDuration || 2,
					region: self.region,
					userId: self.userId,
					// 添加文件成功
					addFileSuccess: function(uploadInfo) {
						self.uploadDisabled = false
						self.resumeDisabled = false
						self.statusText = '添加文件成功, 等待上传...'
						console.log("addFileSuccess: " + uploadInfo.file.name)
						//自动上传
						that.authUpload()
					},
					// 开始上传
					onUploadstarted: function(uploadInfo) {
						// 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
						// 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
						// 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
						// 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
						// 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
						// 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
						if (!uploadInfo.videoId) {
							uni.vk.callFunction({
								url: 'admin/common/sys/getAliyunVodUploadSign',
								data: {
									title: that.title ?? that.file.name,
									name: that.file.name
								},
								success(data) {
									let uploadAuth = data.data.UploadAuth
									let uploadAddress = data.data.UploadAddress
									let videoId = data.data.VideoId
									uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth,
										uploadAddress,
										videoId)
								}
							});

							self.statusText = '文件开始上传...'
							console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo
								.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo
								.object)
						} else {
							uni.vk.callFunction({
								url: 'admin/common/sys/refreshAliyunVodUploadSign',
								data: {
									void: uploadInfo.videoId
								},
								success(data) {
									let uploadAuth = data.data.UploadAuth
									let uploadAddress = data.data.UploadAddress
									let videoId = data.data.VideoId
									uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth,
										uploadAddress,
										videoId)
								}
							});

						}
					},
					// 文件上传成功
					onUploadSucceed: function(uploadInfo) {
						console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo
							.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
						self.statusText = '文件上传成功!'
						that.$emit("success", uploadInfo)
					},
					// 文件上传失败
					onUploadFailed: function(uploadInfo, code, message) {
						console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code +
							", message:" + message)
						self.statusText = '文件上传失败!'
					},
					// 取消文件上传
					onUploadCanceled: function(uploadInfo, code, message) {
						console.log("Canceled file: " + uploadInfo.file.name + ", code: " + code +
							", message:" + message)
						self.statusText = '文件已暂停上传'
					},
					// 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
					onUploadProgress: function(uploadInfo, totalSize, progress) {
						console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" +
							totalSize + ", percent:" + Math.ceil(progress * 100) + "%")
						let progressPercent = Math.ceil(progress * 100)
						self.authProgress = progressPercent
						self.statusText = '文件上传中...'
					},
					// 上传凭证超时
					onUploadTokenExpired: function(uploadInfo) {
						// 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
						// 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
						// 然后调用 resumeUploadWithAuth 方法
						uni.vk.callFunction({
							url: 'admin/common/sys/refreshAliyunVodUploadSign',
							data: {
								void: uploadInfo.videoId
							},
							success(data) {
								let uploadAuth = data.UploadAuth
								uploader.resumeUploadWithAuth(uploadAuth)
								console.log('upload expired and resume upload with uploadauth ' +
									uploadAuth)
							}
						});

						self.statusText = '文件超时...'
					},
					// 全部文件上传结束
					onUploadEnd: function(uploadInfo) {
						console.log("onUploadEnd: uploaded all the files")
						self.statusText = '文件上传完毕'
						
						that.dialogFormVisible = false
					}
				})
				return uploader
			}
		}
	}
</script>

<style lang="scss" scoped>
	.upload {
		padding-bottom: 30px;

		.progress {
			font-size: 24px;
			display: block;
			margin-bottom: 10px;
		}
	}
</style>
