<template>
	<view class="no-user-select page-body">
		<el-row class="login-card">
			<el-col :span="10" class="login-page-right">
				<view class="pic">
					<image src="../../static/images/login-school.svg" mode="widthFix"></image>
				</view>
				<view class="title">
					{{title}}
				</view>
				<view class="copyright">
					{{by}}
				</view>
			</el-col>
			<el-col :span="14">
				<view class="login-view">
					<image class="image" :src="vk.getVuex('$app.config.staticUrl.navBar.logo')" mode="aspectFit">
					</image>
					<text class="login-title">{{$t('login.welcome')}}</text>

					<el-form :model="form1" status-icon :rules="rules" ref="rule1" label-width="60px" class="form-view">
						<el-form-item :label="$t('login.account')" prop="pass" class="form-item">
							<el-input class="input" type="text" v-model="form1.username"></el-input>
						</el-form-item>
						<el-form-item :label="$t('login.password')" prop="checkPass" class="form-item">
							<el-input class="input" type="password" v-model="form1.password" show-password
								maxlength="20"></el-input>
						</el-form-item>
						<view class="password-box">
							<view class="remember-password">
								<el-checkbox v-model="checked">
									<text class="tips" style="font-size: 12px;">{{$t('login.remember')}}</text>
								</el-checkbox>
							</view>
							<view class="forget-password">
								<text @click="forgetPassWord" style="font-size: 12px;">{{$t('login.forget')}}？</text>
							</view>
						</view>
						<el-button class="login_but" type="primary" @click="submit">{{$t('login.login')}}
						</el-button>
					</el-form>
					<!-- <view class="btns-box">
						<text @click="shortMessageLogin">短信验证码登录</text>
						<text @click="noCccount">没有账号？</text>
						<text class="register" @click="register">立即注册</text>
					</view> -->
				</view>
			</el-col>
		</el-row>
	</view>

	</view>
</template>

<script>
	var that; // 当前页面对象
	var vk = uni.vk; // vk实例

	import config from '@/app.config.js'
	export default {
		data() {
			return {
				...config.staticUrl.navBar,
				...config.copyright,
				form1: {
					username: '',
					password: '',
					needPermission: true
				},
				checked: false,
				rules: {

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
		// 监听 - 页面创建时
		created() {
			that = this;
			vk = that.vk;
		},
		mounted() {

		},
		methods: {
			// 页面初始化
			init() {
				let { login } = vk.getVuex('$user');
				if (vk.pubfn.isNotNull(login)) {
					that.form1.username = login.username;
					that.form1.password = login.password;
					that.checked = true;
				}
				if (!getApp().isAllowLoginBackground()) {
					return false;
				}
				// 执行以下函数,主要是为了使云函数提前热启动
				vk.userCenter.checkToken({
					loading: true,
					success: function(data) {
						that.login_success();
					}
				});
			},
			// 表单提交
			submit() {
				vk.userCenter.login({
					data: that.form1,
					success: data => {
						if (!getApp().isAllowLoginBackground(data.userInfo)) {
							vk.alert("您的账户无登陆权限");
							return false;
						}
						if (that.checked) {
							// 账号密码保存本地缓存
							vk.setVuex('$user.login.username', that.form1.username);
							vk.setVuex('$user.login.password', that.form1.password);
						}
						that.login_success();
					}
				});
			},
			//登陆成功
			login_success() {
				// 跳转到首页,或页面返回
				getApp().init();
				var pages = getCurrentPages();
				if (pages.length >= 2 &&
					pages[pages.length - 2] &&
					pages[pages.length - 2].route &&
					pages[pages.length - 2].route.indexOf('login/index') == -1
				) {
					vk.reLaunch("/" + pages[pages.length - 2].route);
				} else {
					// 进入首页
					vk.reLaunch("/pages/index/index");
				}
			},
			forgetPassWord() {
				console.log(`忘记密码了`);
				vk.toast("暂不支持", "none");
			},
			shortMessageLogin() {
				console.log(`短信登录`);
				vk.toast("暂不支持", "none");
			},
			noCccount() {
				console.log(`没有账号`);
				vk.toast("暂不支持", "none");
			},
			register() {
				console.log(`立即注册`);
				vk.toast("暂不支持注册", "none");
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-body {
		width: 100%;
		height: 100vh;
		padding: 0;
		margin: 0;
		background: rgb(214, 233, 255);
		// background: #46d0e7 url(../../static/bg/004.jpg?t=1) no-repeat fixed center center;
		// background-size: cover;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.login-card {
			width: 980px;
		}

		.login-page-right {
			// padding: 6rem 3rem;
			min-height: 100%;
			flex: 1;
			position: relative;
			color: #fff;
			background-color: rgba(58, 98, 215, 1);

			.pic {
				position: relative;
				width: 100%;
				display: flex;
				justify-content: center;
				margin-top: 120px;

				image {
					width: 90%;
				}
			}

			.title {
				box-sizing: inherit;
				width: 100%;
				margin-top: 20px;
				text-align: center;
				color: #FFFFFF;
				font-weight: bold;
				font-size: 28px;
				padding: 20px;
				letter-spacing: 4px;
			}

			.copyright {
				box-sizing: inherit;
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				text-align: center;
				color: #FFFFFF;
				line-height: 1.5;
				padding: 10px;
			}

		}

		.login-view:hover {
			background-color: rgba(255, 255, 255, 1);
		}

		.login-view {
			width: 100%;
			max-width: 420px;
			// border-radius: 7px;
			background-color: rgba(255, 255, 255, 0.97);
			padding: 120px 30px;
			box-sizing: border-box;
			border: 1px solid #f5f5f5;
			box-shadow: 0px 0px 5px 0px #f5f5f5;

			/deep/ .input .el-input__inner {
				border: 0 !important;
				background-color: rgba(255, 255, 255, 0);
			}

			.image {
				display: block;
				width: 64px;
				height: 64px;
				margin: 0 auto;
				margin-bottom: 15px;
				border-radius: 6px;
			}

			.form-view {
				margin-top: 20px;

				.form-item {
					border-bottom: 1px solid #f5f5f5;
				}
			}

			.login-title {
				display: block;
				text-align: center;
				color: #121212;
				font-size: 22px;
				letter-spacing: 2px;
			}

			.login_but {
				width: 100%;
				letter-spacing: 4px;
				font-size: 17px;
			}

			.password-box {
				font-size: 13px;
				color: #b1b1b1;
				margin-bottom: 20px;
				display: flex;
				align-items: center;

				.remember-password {
					flex: 1;
					cursor: pointer;
					user-select: none;
				}

				.forget-password {
					flex: 1;
					text-align: right;
					cursor: pointer;
					user-select: none;

					&:active {
						color: #3a6ffd;
					}
				}
			}

			.tips {
				color: #b1b1b1;
			}

			.btns-box {
				font-size: 13px;
				color: #b1b1b1;
				padding-top: 25px;
				display: flex;
				box-sizing: border-box;

				text {
					cursor: pointer;

					&:first-of-type {
						flex: 1;
					}

					&:nth-of-type(2) {
						margin-right: 8px;
					}
				}

				.register {
					color: rgba(58, 98, 215, 1);
				}
			}
		}
	}
</style>
