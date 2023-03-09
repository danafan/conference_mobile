<template>
	<div class="container flex fc">
		<!-- 顶部 -->
		<div class="white_b pt15 pr15 pb20 pl15 mb10">
			<div class="flex ac mb15" @click="show_calendar = true">
				<img class="date_icon mr10" src="../static/date_icon.png">
				<div class="f16 fw-500 mr10">{{date}}</div>
				<img class="down_arrow" src="../static/down_arrow.png">
			</div>
			<div class="search width-100 flex ac pl12 pr12">
				<img class="search_icon mr13" src="../static/search_icon.png">
				<input class="search_input flex-1" v-model="search" placeholder="搜索">
			</div>
			<div class="width-100 flex jsb mt20 x_scroll">
				<div class="flex ac mr12" v-for="(item,index) in equipment_list" @click="checkEquipment(index)">
					<img class="select_icon mr7" src="../static/select_ed.png" v-if="item.is_checked">
					<img class="select_icon mr7" src="../static/select_dai.png" v-else>
					<div class="f14 text_color">{{item.equipment_name}}</div>
				</div>
			</div>
		</div>
		<!-- tab -->
		<div class="flex mb2">
			<div class="tab_item fw-500 f14" :class="[{'primary_color':active_index == 1},{'white_b':active_index == 1},{'shadow_back':active_index == 0}]" @click="active_index = 1">可预定</div>
			<div class="tab_item fw-500 f14" :class="[{'primary_color':active_index == 0},{'white_b':active_index == 0},{'shadow_back':active_index == 1}]" @click="active_index = 0">全部</div>
		</div>
		<!-- 列表 -->
		<div class="flex-1 scroll-y hide_scrollbar">
			<conference-item :info="item" :current_date="current_date" @checkTime="checkTime" v-for="item in list"/>
		</div>
		<!-- 日期选择 -->
		<van-calendar v-model="show_calendar" @confirm="onConfirm" />
		<!-- 时间选择 -->
		<van-action-sheet v-model="show_sheet" :closeable="false">
			<div class="pt15">
				<div class="pl15">
					<div class="f16 fw-500 text_color mb4">{{title_info.meeting_room_name}}</div>
					<div class="f14 dark_color mb4">{{title_info.equipment_str}}</div>
					<div class="f14 dark_color flex ac">
						<img class="user_icon mr2" src="../static/user_icon.png">
						<div>{{title_info.limit_num}}人</div>
					</div>
				</div>
				<div class="time_list pl15">
					<div class="time_item f14 flex ac jsb pr15" v-for="(item,index) in time_list" @click="checkItem(index)">
						<div class="flex ac">
							<img class="select_icon mr7" src="../static/select_hui.png" v-if="item.is_expire">
							<img class="select_icon mr7" src="../static/select_dis.png" v-if="item.be_booked">
							<img class="select_icon mr7" src="../static/select_dai.png" v-if="!item.be_booked && !item.is_expire && !item.is_active">
							<img class="select_icon mr7" src="../static/select_ed.png" v-if="item.is_active">
							<div class="text_color" :class="{'dark_color':item.is_expire || item.be_booked}">{{item.interval}}</div>
						</div>
						<div class="dark_color" v-if="item.is_expire">已过期</div>
						<div class="dark_color" v-if="item.be_booked">
							已被<span class="user_name">{{item.user_name}}</span>预定
						</div>
					</div>
				</div>
				<div class="button_box flex ac jc">
					<div class="button white_color f15 fw-600" @click="confirmFn">立即预定</div>
				</div>
			</div>
		</van-action-sheet>
	</div>
</template>
<script>
	import ConferenceItem from '../components/conference_item.vue'

	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				show_calendar:false,		//日期选择框
				date:"",					//显示的日期格式
				current_date:"",			//传递的日期格式
				search:"",					//搜索内容
				equipment_list:[],			//设备列表
				active_index:1,				//默认选中的下标
				list:[],					//会议室列表
				show_sheet:false,			//是否显示预定弹窗
				title_info:{},				//顶部信息
				time_list:[],				//时间列表
				start_index:-1,				//第一次选中的下标
				frequency:0,				//当前有效点击次数
			}
		},
		created(){
			this.formatDate(null);
			//获取设备列表
			this.ajaxEquipment();
		},
		watch:{
			//监听输入框变化
			search:function(n,o){
				//获取会议室列表
				this.meetingList();
			},
			//监听tab切换
			active_index:function(n,o){
				//获取会议室列表
				this.meetingList();
			},
		},
		methods:{
			//获取设备列表
			ajaxEquipment(){
				resource.ajaxEquipment().then(res => {
					if(res.data.code == 1){
						this.equipment_list = res.data.data;
						this.equipment_list.map(item => {
							item['is_checked'] = false;
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//时间格式化
			formatDate(time) {
				var date = null;
				if(time){
					date = new Date(time);
				}else{
					date = new Date();
				}
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				var d = date.getDate();
				d = d < 10 ? '0' + d : d;
				var new_date = new Date(y, parseInt(m - 1), d);
				let week =  "日一二三四五六".charAt(new_date.getDay());

				this.date = `${m}月${d}日周${week}`;
				this.current_date = `${y}-${m}-${d}`;

				//获取会议室列表
				this.meetingList();
			},
			//确认选中时间
			onConfirm(date) {
				this.show_calendar = false;
				this.formatDate(date);
			},
			//点击切换选中设备
			checkEquipment(index){
				let new_obj = JSON.parse(JSON.stringify(this.equipment_list[index]));
				new_obj.is_checked = !new_obj.is_checked;
				this.$set(this.equipment_list,index,new_obj);
				//获取会议室列表
				this.meetingList();
			},
			//获取会议室列表
			meetingList(){
				let arg = {
					flag: this.active_index,
					day: this.current_date,
					equipment_id: '',
					search: this.search
				}
				let equipment_ids = [];
				this.equipment_list.map(item => {
					if(item.is_checked == true){
						equipment_ids.push(item.equipment_id)
					}
				})
				arg['equipment_id'] = equipment_ids.join(',');
				this.list = [];
				resource.meetingList(arg).then(res => {
					if(res.data.code == 1){
						let list = res.data.data;
						list.map(item => {
							item['equipment_str'] = item.equipment_name.join('/');
						})
						this.list = list;
					}else{
						this.$toast(res.data.msg);
					}
				})
			},
			//点击某一个会议选择时间
			checkTime(v){
				this.title_info = v.info;
				let number_list = v.number_list;
				number_list.map(item => {
					item['is_active'] = false;
				})
				this.time_list = number_list;
				this.show_sheet = true;
			},
			//点击选择某个时间段
			checkItem(index){
				//点击的是已过期或者被预定的，直接不向下执行
				if(this.time_list[index].is_expire || this.time_list[index].be_booked){
					return;
				}
				var new_list = JSON.parse(JSON.stringify(this.time_list));
				if(this.frequency == 0){			//第一次点击
					new_list.map((item,i) => {
						if(index == i){
							item.is_active = true;
						}else{
							item.is_active = false;
						}
					})
					this.start_index = index;
					this.frequency = 1;
				}else if(this.frequency == 1){	//第二次点击
					if(this.start_index == index){
						new_list[index].is_active = false;
						this.time_list = new_list;
						this.frequency = 0;
						return;
					}
					if(this.getNum(index).is_active == 1 && this.getNum(index).is_expire == 0 && this.getNum(index).be_booked == 0){
						new_list.map((item,i_i) => {
							if(i_i >= this.getNum(index).s_index && i_i <= this.getNum(index).e_index){
								item.is_active = true;
							}
						})
						this.frequency = 0;
					}
				}
				this.time_list = new_list;
			},
			//获取被预定、已过期、已选中的数量
			getNum(index){
				var new_list = JSON.parse(JSON.stringify(this.time_list));
				var min_index = Math.min(this.start_index,index);
				let arr = [];
				let s_index = -1;
				let e_index = -1;
				if(min_index == this.start_index){
					arr = new_list.slice(min_index,index + 1);
					s_index = this.start_index;
					e_index = index;
				}
				if(min_index == index){
					arr = new_list.slice(index,this.start_index + 1);
					s_index = index;
					e_index = this.start_index;
				}

				let not_select_arr1 = arr.filter(item => {
					return item.is_active;
				})

				let not_select_arr2 = arr.filter(item => {
					return item.is_expire;
				})

				let not_select_arr3 = arr.filter(item => {
					return item.be_booked;
				})

				let arg = {
					is_active:not_select_arr1.length,
					is_expire:not_select_arr2.length,
					be_booked:not_select_arr3.length,
					s_index:s_index,
					e_index:e_index
				}
				return arg;
			},	
			//点击立即预订
			confirmFn(){
				let arr = this.time_list.filter(item => {
					return item.is_active;
				})
				if(arr.length == 0){
					this.$toast('请选择会议时间！')
				}else{
					let start_time = arr[0].arg_start_time;
					let end_time = arr[arr.length - 1].arg_end_time;
					let title = this.title_info.meeting_room_name;
					this.$router.push(`/create_metting?start_time=${start_time}&end_time=${end_time}&title=${title}`)
				}
			}
		},
		components:{
			ConferenceItem
		}
	}
</script>
<style lang="less" scoped>
.date_icon{
	width: 18px;
	height: 18px;
}
.down_arrow{
	width: 9.9px;
	height: 5.5px;
}
.search{
	height: 36px;
	background: #F0EFFE;
	border-radius: 20px;
	.search_icon{
		width: 13px;
		height: 13px;
	}
	.search_input{
		outline: none;
		border: none;
		background: #F0EFFE;
		font-size: 12px;
		color: #333333;
	}
}
.select_icon{
	width: 18px;
	height: 18px;
}
.tab_item{
	border-radius: 8px 8px 0px 0px;
	width: 50%;
	text-align: center;
	height: 52px;
	line-height: 52px;
}
.shadow_back{
	background: linear-gradient(180deg, #DAE6FF 0%, #F8FBFF 100%);
}
.user_icon{
	width: 12px;
	height: 12px;
}
.time_list{
	max-height: 314px;
	overflow-y: scroll;
	.time_item{
		height: 44px;
		border-bottom: 1px solid #F0F0F0;
	}
}
.user_name{
	color: #6670FD;
}
.button_box{
	height: 86px;
	.button{
		width: 311px;
		text-align:center;
		height: 45px;
		line-height: 45px;
		background: #6670FD;
		border-radius: 23px;
	}
}
</style>