<template>
	<view class="group-time">
		<el-input placeholder="时" type="number" v-model="hour">
			<template slot="append">时</template>
		</el-input>
		<el-input placeholder="分" type="number" v-model="minute">
			<template slot="append">分</template>
		</el-input>
		<el-input placeholder="秒" type="number" v-model="second">
			<template slot="append">秒</template>
		</el-input>
	</view>
</template>

<script>
	export default {
		name: "secondTimeInput",
		props: {
			value: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				val: 0,
				hour: 0,
				minute: 0,
				second: 0,
			};
		},
		created() {
			this.val = this.value
			this.hour = parseInt(Number(this.val) / 3600)
			this.minute = parseInt((Number(this.val) % 3600) / 60)
			this.second = parseInt((Number(this.val) % 3600) % 60)
		},
		watch: {
			value(newVal) {
				if (newVal == this.val) return
				this.val = this.value
				this.hour = parseInt(Number(this.val) / 3600)
				this.minute = parseInt((Number(this.val) % 3600) / 60)
				this.second = parseInt((Number(this.val) % 3600) % 60)
			},
			hour(newVal) {
				this.val = Number(this.hour * 3600) + Number(this.minute * 60) + Number(this.second)
				this.$emit('input', this.val);
			},
			minute(newVal) {
				this.val = Number(this.hour * 3600) + Number(this.minute * 60) + Number(this.second)
				this.$emit('input', this.val);
			},
			second(newVal) {
				this.val = Number(this.hour * 3600) + Number(this.minute * 60) + Number(this.second)
				this.$emit('input', this.val);
			}
		}
	}
</script>

<style lang="scss">
	.group-time {
		display: flex;
	}
</style>
