<template>
	<div class="white_b pt10 pr10 pb25 pl10">
		<div class="flex jsb mb10">
			<div class="flex fc jsb f14 text_color">
				<div class="fw-500">国泰16楼2号会议室</div>
				<div>投影仪/白板</div>
				<div class="flex ac">
					<img class="user_icon mr2" src="../static/user_icon.png">
					<div class="mr10">15人</div>
					<img class="location_icon mr2" src="../static/location_icon.png">
					<div>国泰科技大厦</div>
				</div>
			</div>
			<img class="image border" src="../static/record_icon.png">
		</div>
		<div class="select_time flex">
			<div class="time_item relative" :class="[{'right_border':index > 0 && index%2 == 1 && index != number_list.length - 1},{'is_expire':item.is_expire},{'be_booked':item.be_booked}]" v-for="(item,index) in number_list">
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
					is_expire:false,
					be_booked:false,
					user_name:"",
					interval:"07:00~07:30",
				},{
					point_time:8,
					interval:"07:30~08:00",
				},{
					point_time:null,
					is_expire:true,
					be_booked:false,
					user_name:"",
					interval:"08:00~08:30",
				},{
					point_time:9,
					interval:"08:30~09:00",
				},{
					point_time:null,
					is_expire:false,
					be_booked:true,
					user_name:"彪子",
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
		methods:{

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