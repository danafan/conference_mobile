<template>
	<div class="container flex fc">
		<!-- 顶部 -->
		<div class="white_b pt15 pr15 pl15 mb4">
			<div class="search width-100 flex ac pl12 pr12 mb7">
				<img class="search_icon mr13" src="../static/search_icon.png">
				<input class="search_input flex-1" v-model="search" placeholder="搜索会议标题">
			</div>
			<div class="flex jsb">
				<div class="tab_item relative black_color f14 flex ac jc" v-for="item in tab_list" @click="meeting_status = item.id">
					<div :class="{'primary_color':item.id == meeting_status}">{{item.name}}</div>
					<div class="active_line absolute" v-if="item.id == meeting_status"></div>
				</div>
			</div>
		</div>
		<!-- 列表 -->
		<van-list v-model:loading="loading" :finished="finished" @load="loadMore"
		finished-text="没有更多了" class="flex-1 scroll-y hide_scrollbar" v-if="listArray.length > 0">
		<div class="white_b text_color mb4" v-for="(item,index) in listArray">
			<div class="item_top flex fc jsb pl15 pt12 pb12">
				<div class="f16 fw-500">{{item.meeting_title}}</div>
				<div class="f14">时间：{{item.time}}</div>
				<div class="f14">地点：{{item.meeting_address}}</div>
			</div>
			<div class="line"></div>
			<div class="flex f14">
				<div class="button flex-1 border_right" v-if="item.cancle_status == 1">取消日程</div>
				<div class="button flex-1 primary_color fw-500" @click="$router.push(`/detail?meeting_id=${item.meeting_id}`)">会议详情</div>
			</div>
		</div>
	</van-list>
</div>
</template>
<script>
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				search:"",		//搜索的内容
				tab_list:[{
					name:'全部',
					id:'0'
				},{
					name:'已预定',
					id:'1'
				},{
					name:'进行中',
					id:'2'
				},{
					name:'已结束',
					id:'3'
				}],								//导航列表
				meeting_status:"0",				//当前选中的导航
				loading:false,
				finished:false,
				page:0,
				pagesize:10,
				listArray:[],			//列表
			}
		},
		watch:{
			//监听输入框变化
			search:function(n,o){
				//获取会议室列表
				this.meetingRecord(true);
			},
			//切换tab
			meeting_status:function(n,o){
				//获取会议记录
				this.meetingRecord(true);	
			}
		},
		created(){
			//获取会议记录
			this.meetingRecord(true);
		},
		methods:{
			//加载更多
			loadMore(){
				this.page += 1;
				//列表
				this.meetingRecord(false);
			},
			//获取会议记录
			meetingRecord(is_reload){
				if(is_reload){
					this.listArray = [];
					this.page = 1;
					this.finished = false;
				}
				let arg = {
					meeting_status:this.meeting_status,
					search:this.search,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.meetingRecord(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						res.data.data.data.map(item => {
							item['time'] = this.filterMeetingTime(item.start_time,item.end_time);
						})
						this.listArray = [...this.listArray,...res.data.data.data];
						if(this.page == res.data.data.last_page){
							this.finished = true;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			filterMeetingTime(start_time,end_time){
				let year_list = start_time.split(' ')[0].split('-');
				let year = `${year_list[0]}年${year_list[1]}月${year_list[2]}日`;
				let start = `${start_time.split(' ')[1].split(':')[0]}:${start_time.split(' ')[1].split(':')[1]}`;
				let end = `${end_time.split(' ')[1].split(':')[0]}:${end_time.split(' ')[1].split(':')[1]}`;
				return `${year} ${start}~${end}`; 
			}
		}
	}
</script>
<style lang="less" scoped>
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
.tab_item{
	height: 36px;
}
.active_line{
	background-color: #2A37FD;
	width: 100%;
	height: 2px;
	bottom: 0;
}
.item_top{
	height: 100px;
}
.line{
	width: 100%;
	height: 1px;
	background-color: #E8E8E8;
}
.border_right{
	border-right: 1px solid #E8E8E8;
}
.button{
	text-align: center;
	height: 40px;
	line-height: 40px;
}
</style>