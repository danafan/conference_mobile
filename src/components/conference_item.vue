<template>
	<div class="white_b pt10 pr10 pb25 pl10 mb4" @click="checkTime(info)">
		<div class="flex jsb mb10">
			<div class="flex fc jsb f14 text_color">
				<div class="fw-500">{{info.meeting_room_name}}</div>
				<div>{{info.equipment_str}}</div>
				<div class="flex ac">
					<img class="user_icon mr2" src="../static/user_icon.png">
					<div class="mr10">{{info.limit_num}}人</div>
					<img class="location_icon mr2" src="../static/location_icon.png">
					<div>{{info.meeting_address}}</div>
				</div>
			</div>
			<img class="image" :src="domain + info.meeting_image">
		</div>
		<div class="select_time flex">
			<div class="time_item relative" :class="[{'right_border':index > 0 && index%2 == 1 && index != number_list.length - 1},{'be_booked':item.be_booked},{'is_expire':item.is_expire}]" v-for="(item,index) in number_list">
				<div class="absolute number f12 text_color" :class="[{'left':index == 0},{'re_left':item.point_time == 8 || item.point_time == 9}]">{{item.point_time}}</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return {
				number_list:[{
					point_time:7,
					interval:"07:00~07:30",
				},{
					point_time:8,
					interval:"07:30~08:00",
				},{
					point_time:null,
					interval:"08:00~08:30",
				},{
					point_time:9,
					interval:"08:30~09:00",
				},{
					point_time:null,
					interval:"09:00~09:30",
				},{
					point_time:10,
					interval:"09:30~10:00",
				},{
					point_time:null,
					interval:"10:00~10:30",
				},{
					point_time:11,
					interval:"10:30~11:00",
				},{
					point_time:null,
					interval:"11:00~11:30",
				},{
					point_time:12,
					interval:"11:30~12:00",
				},{
					point_time:null,
					interval:"12:00~12:30",
				},{
					point_time:13,
					interval:"12:30~13:00",
				},{
					point_time:null,
					interval:"13:00~13:30",
				},{
					point_time:14,
					interval:"13:30~14:00",
				},{
					point_time:null,
					interval:"14:00~14:30",
				},{
					point_time:15,
					interval:"14:30~15:00",
				},{
					point_time:null,
					interval:"15:00~15:30"
				},{
					point_time:16,
					interval:"15:30~16:00",
				},{
					point_time:null,
					interval:"16:00~16:30",
				},{
					point_time:17,
					interval:"16:30~17:00",
				},{
					point_time:null,
					interval:"17:00~17:30",
				},{
					point_time:18,
					interval:"17:30~18:00",
				},{
					point_time:null,
					interval:"18:00~18:30",
				},{
					point_time:19,
					interval:"18:30~19:00",
				},{
					point_time:null,
					interval:"19:00~19:30",
				},{
					point_time:20,
					interval:"19:30~20:00",
				},{
					point_time:null,
					interval:"20:00~20:30",
				},{
					point_time:21,
					interval:"20:30~21:00",
				},{
					point_time:null,
					interval:"21:00~21:30",
				},{
					point_time:22,
					interval:"21:30~22:00",
				},{
					point_time:null,
					interval:"22:00~22:30",
				},{
					point_time:23,
					interval:"22:30~23:00",
				}],
			}
		},
		props:{
			//单个会议室
			info:{
				type:Object,
				default:() => {

				}
			},
			//当前选中的时间
			current_date:{
				type:String,
				default:""
			},
		},
		computed:{
			//图片前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		created(){
			//设置默认状态
			this.filterTime();
		},
		methods:{
			//设置默认状态
			filterTime(){
				if(this.info.meeting_records.length > 0){
					this.info.meeting_records.map(r_item => {
						var arr = [];
						this.number_list.map((item,index) => {
							let start_time = item.interval.split('~')[0];
							let end_time = item.interval.split('~')[1];
							let arg = this.getStatus(start_time,end_time);
							for(let k in arg){
								item[k] = arg[k];
							}

							if(r_item.start_time == item.arg_start_time && r_item.end_time == item.arg_end_time){
								arr[0] = index;
								arr[1] = index;
							}else if(r_item.start_time == item.arg_start_time || r_item.end_time == item.arg_end_time){
								arr.push(index)
							}
						})
						this.number_list.map((item,index) => {
							if(index >= arr[0] && index <= arr[1]){
								item['be_booked'] = true;
								item['user_name'] = r_item.admin_name;
							}
						})
					})
				}else{
					this.number_list.map((item,index) => {
						let start_time = item.interval.split('~')[0];
						let end_time = item.interval.split('~')[1];
						let arg = this.getStatus(start_time,end_time);
						item['be_booked'] = false;
						for(let k in arg){
							item[k] = arg[k];
						}
					})
				}
			},
			//处理每一格的时间
			getStatus(start_time,end_time){
				var now = new Date(); 				//当前日期  
				var nowYear = now.getYear(); 		//当前年 
				nowYear += (nowYear < 2000) ? 1900 : 0;
				var nowMonth = now.getMonth()<10?`0${now.getMonth() + 1}`:now.getMonth() + 1; 		//当前月 
				var nowDay = now.getDate()<10?`0${now.getDate()}`:now.getDate(); 		//当前日 
				var nowHours = now.getHours()<10?`0${now.getHours()}`:now.getHours();  	//当前小时
				var nowMinutes = now.getMinutes()<10?`0${now.getMinutes()}`:now.getMinutes();  //当前分钟
				//当前时间
				let current_time = this.current_date == `${nowYear}-${nowMonth}-${nowDay}`?`${nowYear}-${nowMonth}-${nowDay} ${nowHours}:${nowMinutes}:00`:`${this.current_date} 00:00:00`;
				//指定的开始时间
				let set_start_time = `${this.current_date} ${start_time}:00`;
				//指定的结束时间
				let set_end_time = `${this.current_date} ${end_time}:00`;
				
				//当前时间是否超出指定的结束时间
				let is_expire = current_time > set_end_time;

				let arg = {
					is_expire:is_expire,				//是否过期
					arg_start_time:set_start_time,		//开始时间
					arg_end_time:set_end_time			//结束时间
				}
				return arg;
			},
			//点击时间条预定
			checkTime(info){
				let v = {
					info:info,
					number_list:this.number_list
				}
				this.$emit('checkTime',v);
			}
		}
	}
</script>
<style lang="less" scoped>
.user_icon{
	width: 12px;
	height: 12px;
}
.location_icon{
	width: 10px;
	height: 12px;
}
.image{
	width: 110px;
	height: 64px;
}
.select_time{
	border-radius: 2px;
	border: 1px solid #E8E8E8;
	.time_item{
		width: 28px;
		height: 14px;
		.number{
			top:12px;
			right: -50%;
			transform: translate(0,50%);
		}
		.left{
			left: -50%;
			transform: translate(0,50%);
		}
		.re_left{
			right:-4px;
		}
	}
	.is_expire{
		background-color: #E6E6E6;
	}
	.be_booked{
		background-color: #C7D8FF;
	}
	.right_border{
		border-right: 1px solid #E8E8E8;
	}
}

</style>