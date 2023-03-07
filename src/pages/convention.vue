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
			<div class="tab_item fw-500 f14" :class="[{'primary_color':active_index == 0},{'white_b':active_index == 0},{'shadow_back':active_index == 1}]" @click="active_index = 0">可预定</div>
			<div class="tab_item fw-500 f14" :class="[{'primary_color':active_index == 1},{'white_b':active_index == 1},{'shadow_back':active_index == 0}]" @click="active_index = 1">全部</div>
		</div>
		<!-- 列表 -->
		<div class="flex-1 scroll-y hide_scrollbar">
			<conference-item :info="item" :current_date="current_date" v-for="item in list"/>
		</div>
		<!-- 日期选择 -->
		<van-calendar v-model="show_calendar" @confirm="onConfirm" />
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
				equipment_list:[{
					equipment_name:"电视",
					equipment_id:'1',
					is_checked:false
				},{
					equipment_name:"电话",
					equipment_id:'2',
					is_checked:false
				},{
					equipment_name:"投影",
					equipment_id:'3',
					is_checked:false
				},{
					equipment_name:"白板",
					equipment_id:'4',
					is_checked:false
				},{
					equipment_name:"视频",
					equipment_id:'5',
					is_checked:false
				},{
					equipment_name:"电视",
					equipment_id:'1',
					is_checked:false
				},{
					equipment_name:"电话",
					equipment_id:'2',
					is_checked:false
				},{
					equipment_name:"投影",
					equipment_id:'3',
					is_checked:false
				},{
					equipment_name:"白板",
					equipment_id:'4',
					is_checked:false
				},{
					equipment_name:"视频",
					equipment_id:'5',
					is_checked:false
				}],							//设备列表
				active_index:0,				//默认选中的下标
				list:[],					//会议室列表
			}
		},
		created(){
			this.formatDate(null);
		},
		methods:{
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
				var date = new Date(y, parseInt(m - 1), d);
				let week =  "日一二三四五六".charAt(date.getDay());

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
				this.equipment_list[index].is_checked = !this.equipment_list[index].is_checked;
			},
			//获取会议室列表
			meetingList(){
				let arg = {
					flag: 1,
					day: this.current_date,
					equipment_id: '',
					search: ''
				}
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
</style>