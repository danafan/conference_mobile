<template>
	<div class="container flex fc">
		<div class="flex mb2">
			<div class="tab_item white_b fw-500 f14 flex-1" :class="[{'primary_color':active_index == index},{'shadow_back':active_index == index}]" @click="active_index = index" v-for="(item,index) in tab_list">{{item.name}}</div>
		</div>
		<div class="flex-1 scroll-y hide_scrollbar" v-if="user_list.length > 0">
			<div class="user_item white_b pl15 f14 fw-500" v-for="item in user_list">彪子</div>
		</div>
		<empty-page v-else/>
	</div>
</template>
<script>
	import EmptyPage from '../components/empty_page.vue'
	export default{
		data(){
			return{
				meeting_id:"",				//会议ID
				tab_list:[{
					name:'全部',
					id:'0'
				},{
					name:'已签到',
					id:'1'
				},{
					name:'未签到',
					id:'2'
				}],							//tab列表
				active_index:0,				//当前选中的下标
				user_list:[],				//用户列表
			}
		},
		created(){
			this.meeting_id = this.$route.query.meeting_id;
			console.log(this.meeting_id)
		},
		components:{
			EmptyPage
		}
	}
</script>
<style lang="less" scoped>
.tab_item{
	border-radius: 8px 8px 0px 0px;
	text-align: center;
	height: 52px;
	line-height: 52px;
}
.shadow_back{
	background: linear-gradient(180deg, #DAE6FF 0%, #F8FBFF 100%);
}
.user_item{
	height: 55px;
	line-height: 55px;
}
</style>