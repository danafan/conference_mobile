<template>
	<div class="container pt3 pb3 text_color">
		<div class="white_b pl15 pr15 pb12 mb4">
			<input v-model="title" class="title_input f16 fw-500" placeholder="会议标题">
			<div class="flex ac jsb">
				<div class="f14 fw-500" @click="checkDate('start')">
					<div>{{view_start_date}}</div>
					<div>{{view_start_hm}}</div>
				</div>
				<img class="right_arrow" src="../static/right_arrow.png">
				<div class="f14 fw-500" @click="checkDate('end')">
					<div>{{view_end_date}}</div>
					<div>{{view_end_hm}}</div>
				</div>
			</div>
		</div>
		<div class="white_b">
			<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500">
				<div>大级别</div>
				<img class="item_right_arrow" src="../static/right_arrow.png">
			</div>
			<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500">
				<div>添加参与人</div>
				<img class="item_right_arrow" src="../static/right_arrow.png">
			</div>
			<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500">
				<div>国泰会议室</div>
				<img class="item_right_arrow" src="../static/right_arrow.png">
			</div>
			<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500">
				<div>开始替你</div>
				<img class="item_right_arrow" src="../static/right_arrow.png">
			</div>
		</div>
		<van-action-sheet @close="currentDate = null" v-model="show_check_date">
			<van-datetime-picker
			v-model="currentDate"
			type="datetime"
			:filter="filterMinute"
			@cancel="show_check_date = false"
			@confirm="confirmDate"
			@change="changeDate"
			:title="picker_title"
			:min-date="minDate"
			/>
		</van-action-sheet>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				title:"",				//会议标题
				start_time:"",			//开始时间
				view_start_date:"",		//显示的开始时间上面
				view_start_hm:"",		//显示的开始时间下面
				end_time:"",			//结束时间
				view_end_date:"",		//显示的结束时间上面
				view_end_hm:"",			//显示的结束时间下面
				show_check_date:false,	//切换时间弹窗是否显示
				date_type:'',			//点击的时间类型
				minDate: new Date(),	//最小可选时间
				picker_title:"",		//弹窗标题（显示周）
				currentDate: null,		//当前时间
			}
		},
		created(){
			let query = this.$route.query;
			this.title = `【${query.title}】预约`;
			this.start_time = query.start_time;
			this.end_time = query.end_time;
			//设置开始时间（展示）
			this.setStartDate();
			//设置开始时间（展示）
			this.setEndDate();
		},
		methods:{
			//获取月日
			getYMD(time){
				let arr = time.split(" ")[0].split("-").splice(1,2);
				return `${parseInt(arr[0])}月${parseInt(arr[1])}日`;
			},
			//获取时分
			getHM(time){
				let arr = time.split(" ")[1].split(":").splice(0,2);
				return `${arr[0]}:${arr[1]}`;
			},
			//获取周
			getWeek(time){
				let date = new Date(time);
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				var d = date.getDate();
				d = d < 10 ? '0' + d : d;
				var new_date = new Date(y, parseInt(m - 1), d);
				let week =  "日一二三四五六".charAt(new_date.getDay());
				return `周${week}`;
			},
			//自定义分钟间隔
			filterMinute(type, options) {
				if (type === 'minute') {
					return options.filter((option) => option % 30 === 0);
				}
				return options;
			},
			//点击切换时间
			checkDate(type){
				this.date_type = type;
				if(this.date_type == 'start'){
					this.currentDate = new Date(this.start_time);
				}else{
					this.currentDate = new Date(this.end_time);
				}
				this.picker_title = this.getWeek(this.currentDate);
				this.show_check_date = true;
			},
			//点击确认选中时间
			confirmDate(date){
				let y = date.getFullYear().toString(); // 年
			    let m = (date.getMonth() + 1).toString(); // 月
			    let d = date.getDate().toString(); // 日
			    let h = date.getHours() < 10?`0${date.getHours().toString()}`:date.getHours().toString(); // 时
			    let mm = date.getMinutes() < 10?`0${date.getMinutes().toString()}`:date.getMinutes().toString(); // 分
			    let s = '00'; // 秒
			    let new_time = `${y}-${m}-${d} ${h}:${mm}:${s}`;
			    if(this.date_type == 'start'){
			    	this.start_time = new_time;
			    	//设置开始时间（展示）
			    	this.setStartDate();
			    }else{
			    	this.end_time = new_time;
			    	//设置开始时间（展示）
			    	this.setEndDate();
			    }
			    this.show_check_date = false;
			},
			//切换时间
			changeDate(v){
				let new_date = `${v.getValues()[0]}-${v.getValues()[1]}-${v.getValues()[2]} ${v.getValues()[3]}:${v.getValues()[4]}:00`
				this.picker_title = this.getWeek(new_date);
			},
			//设置开始时间（展示）
			setStartDate(){
				this.view_start_date = this.getYMD(this.start_time) + ' ' + this.getWeek(this.start_time);
				this.view_start_hm = this.getHM(this.start_time);
			},
			//设置结束时间（展示）
			setEndDate(){
				this.view_end_date = this.getYMD(this.end_time) + ' ' + this.getWeek(this.end_time);
				this.view_end_hm = this.getHM(this.end_time);
			}
		}
	}
</script>
<style lang="less" scoped>
.title_input{
	position: relative;
	bottom: 4px;
	border: none;
	outline: none;
	height: 46px;
	line-height: 46px;
}
.right_arrow{
	width: 17px;
	height: 17px;
}
.menu_item{
	border-bottom:1px solid #E8E8E8;
	height: 54px;
	.item_right_arrow{
		width: 15px;
		height: 15px;
	}
}

</style>