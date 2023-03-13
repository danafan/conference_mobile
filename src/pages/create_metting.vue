<template>
	<div class="container pt3 pb3 text_color flex fc">
		<div class="flex-1 scroll-y hide_scrollbar">
			<div class="white_b pl15 pr15 pb12 mb4">
				<input v-model="title" class="title_input width-100 f16 fw-500" placeholder="会议标题">
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
				<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500" @click="checkSheet('1')">
					<div>{{meeting_level_name}}</div>
					<img class="item_right_arrow" src="../static/right_arrow.png">
				</div>
				<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500" @click.stop>
					<div>添加参与人</div>
					<div class="flex ac" @click="checkUser">
						<div class="dark_color">{{userInfo.real_name}}等{{selected_user.length}}人</div>
						<img class="item_right_arrow" src="../static/right_arrow.png">
					</div>
				</div>
				<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500" @click="checkSheet('2')">
					<div>{{room_name}}</div>
					<img class="item_right_arrow" src="../static/right_arrow.png">
				</div>
				<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500" @click="checkSheet('3')">
					<div>{{notice_type_name}}</div>
					<img class="item_right_arrow" src="../static/right_arrow.png">
				</div>
				<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500" @click.stop>
					<div>单聊推送</div>
					<van-switch v-model="is_chat_notice" size="22" :active-value="1" :inactive-value="0" active-color="#2A37FD" inactive-color="#dcdee0" />
				</div>
				<div class="pl15 pr15 pt15 pb15 f14 fw-500">
					<textarea class="textarea" :rows="5" v-model="remark" placeholder="请输入描述"></textarea>
				</div>
			</div>
		</div>
		<div class="bottom_content flex ac jc">
			<div class="over_button white_color f15 fw-600" @click="confirmFn">完成</div>
		</div>
		<!-- 切换时间 -->
		<van-action-sheet @close="currentTime = null" v-model="show_check_date">
			<van-datetime-picker
			v-model="currentTime"
			type="time"
			:filter="filterMinute"
			title="选择时间"
			:min-hour="minHour"
			:max-hour="maxHour"
			:max-minute="maxM"
			:min-minute="minM"
			@change="changeTime"
			@confirm="confirmTime"
			@cancel="show_check_date = false"
			/>
		</van-action-sheet>
		<!-- 级别/会议室/通知类型 -->
		<van-action-sheet @close="default_index = -1" v-model="show_sheet">
			<van-picker
			:title="sheet_title"
			show-toolbar
			:default-index="default_index"
			:columns="data_list"
			@confirm="onConfirm"
			@cancel="show_sheet = false"
			/>
		</van-action-sheet>
	</div>
</template>
<script>
	import * as dd from 'dingtalk-jsapi';

	import resource from '../api/resource.js'
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
				minHour: "7",			//最小可选小时
				maxHour:"23",			//最大可选小时
				minM:0,					//最小可选分钟
				maxM:30,				//最大可选分钟
				currentTime: null,		//当前时间
				show_sheet:false,		//选择级别/会议室/通知类型弹窗
				sheet_title:"",			//弹窗标题
				sheet_type:"",			//弹窗类型（1:级别；2:会议室：3:通知类型）
				data_list:[],			//弹窗列表
				default_index:-1,		//默认选中的选项下标
				meeting_level_list:[],		//级别列表
				meeting_level_name:"",		//选中的会议级别name
				meeting_level_id:"",		//选中的会议级别id
				meeting_level_index:-1,		//默认选中的级别下标
				room_list:[],				//会议室列表
				room_name:"",				//选中的会议室name
				room_id:"",					//选中的会议室id
				room_index:-1,				//默认选中的会议室下标
				notice_type_list:[],		//通知类型列表
				notice_type_name:"",		//选中的通知类型name
				notice_type_id:"",			//选中的通知类型id
				notice_type_index:-1,		//默认选中的通知类型下标
				remark:"",					//描述内容
				is_chat_notice:1,			//是否单聊通知
				selected_user:[],			//已选中的用户
				pickedUsers:[],				//除本人外的其余人的ID
			}
		},
		created(){
			let query = this.$route.query;
			this.title = `【${query.title}】预约`;
			this.room_name = query.title;
			this.room_id = query.id;
			this.start_time = query.start_time;
			this.end_time = query.end_time;
			//设置当前选中的参会人员
			this.setPickedUsers([]);
			//设置开始时间（展示）
			this.setStartDate();
			//设置开始时间（展示）
			this.setEndDate();
			//获取预定信息
			this.addMeetingGet();
		},
		computed:{
			//用户信息
			userInfo(){
				return this.$store.state.userInfo;
			},
			//appId
			appId(){
				return this.$store.state.appId;
			},
			//corpId
			corpId(){
				return this.$store.state.corpId;
			},
		},
		methods:{
			//获取预定信息
			addMeetingGet(){
				resource.addMeetingGet().then(res => {
					if(res.data.code == 1){
						// 处理级别
						this.meeting_level_list = res.data.data.meeting_level;
						this.meeting_level_index = this.meeting_level_list.findIndex(item => {
							return item.meeting_level_name == '部门级';
						})
						this.meeting_level_name = this.meeting_level_list[this.meeting_level_index].meeting_level_name;
						this.meeting_level_id = this.meeting_level_list[this.meeting_level_index].meeting_level_id;
						//处理会议室
						this.room_list = res.data.data.meeting_room;
						this.room_index = this.room_list.findIndex(item => {
							return item.meeting_room_id == this.room_id;
						})
						//处理通知类型
						this.notice_type_list = res.data.data.notice_type;
						this.notice_type_index = this.notice_type_list.findIndex(item => {
							return item.default == 1;
						})
						this.notice_type_name = this.notice_type_list[this.notice_type_index].name;
						this.notice_type_id = this.notice_type_list[this.notice_type_index].id;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 点击切换级别/会议室/通知方式
			checkSheet(type){
				this.sheet_type = type;
				this.data_list = [];
				switch(this.sheet_type){
					case '1':
					this.meeting_level_list.map(item => {
						let new_obj = {
							text:item.meeting_level_name,
							id:item.meeting_level_id
						}
						this.data_list.push(new_obj)
					})
					this.default_index = this.meeting_level_index;
					this.sheet_title = "会议级别";
					break;
					case '2':
					this.room_list.map(item => {
						let new_obj = {
							text:item.meeting_room_name,
							id:item.meeting_room_id
						}
						this.data_list.push(new_obj)
					})
					this.default_index = this.room_index;
					this.sheet_title = "会议室";
					break;
					case '3':
					this.notice_type_list.map(item => {
						let new_obj = {
							text:item.name,
							id:item.id
						}
						this.data_list.push(new_obj)
					})
					this.default_index = this.notice_type_index;
					this.sheet_title = "消息通知";
					break;
					default:
					return;
				}
				this.show_sheet = true;
			},
			//确认选中某个选项
			onConfirm(value, index) {
				switch(this.sheet_type){
					case '1':
					this.meeting_level_index = index;
					this.meeting_level_name = value.text;
					this.meeting_level_id = value.id;
					break;
					case '2':
					this.room_index = index;
					this.room_name = value.text;
					this.room_id = value.id;
					break;
					case '3':
					this.notice_type_index = index;
					this.notice_type_name = value.text;
					this.notice_type_id = value.id;
					break;
					default:
					return;
				}
				this.show_sheet = false;
			},
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
					this.currentTime = this.start_time.split(' ')[1].split(":").splice(0,2).join(':');
				}else{
					this.currentTime = this.end_time.split(' ')[1].split(":").splice(0,2).join(':');
				}
				this.show_check_date = true;
			},
			//切换时间
			changeTime(v){
				if(v.getValues()[0] == '23'){
					this.maxM = 0;
				}else{
					this.maxM = 30;
				}
				this.currentTime = `${v.getValues()[0]}:${v.getValues()[1]}`
			},
			//判断开始时间是否大于结束时间
			confirmTime(){
				if(this.date_type == 'start'){
					let c_s = this.start_time;
					let c_e = `${this.end_time.split(' ')[0]} ${this.currentTime}:00`;
					if(c_s >= c_e){
						this.$toast('结束时间必须大于开始时间!')
					}else{
						this.start_time = `${this.start_time.split(' ')[0]} ${this.currentTime}:00`;
						//设置开始时间（展示）
			    		this.setStartDate();
						this.show_check_date = false;
					}
				}else{
					let c_s = this.start_time;
					let c_e = `${this.end_time.split(' ')[0]} ${this.currentTime}:00`;
					if(c_s >= c_e){
						this.$toast('结束时间必须大于开始时间!')
					}else{
						this.end_time = `${this.end_time.split(' ')[0]} ${this.currentTime}:00`;
						//设置开始时间（展示）
			    		this.setEndDate();
						this.show_check_date = false;
					}
				}
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
			},
			//点击批量选择参会人员
			checkUser(){
				dd.ready(() => {
					dd.biz.contact.complexPicker({
					    title:"选择参会人员",            	//标题
					    corpId:this.corpId,  			//企业的corpId
					    multiple:true,            		//是否多选
					    limitTips:"超出了",          		//超过限定人数返回提示
					    maxUsers:1000,            		//最大可选人数
					    pickedUsers:this.pickedUsers,   //已选用户
					    pickedDepartments:[],          	//已选部门
					    disabledUsers:[],            	//不可选用户
					    disabledDepartments:[],        	//不可选部门
					    requiredUsers:[this.userInfo.user_id],
					    requiredDepartments:[],        	
					    appId:this.appId,              	
					    permissionType:"GLOBAL",          
					    responseUserOnly:true,         	//返回人，或者返回人和部门
					    startWithDepartmentId:0 ,   	//仅支持0和-1
					    onSuccess: (result) => {
					    	//设置当前选中的参会人员
					    	this.setPickedUsers(result.users)
					    },
					    onFail : function(err) {}
					});
				})
			},
			//设置当前选中的参会人员
			setPickedUsers(users){
				this.selected_user = users;
				let current_user = {
					name:this.userInfo.real_name,
					emplId :this.userInfo.user_id
				}
				let arr = this.selected_user.filter(item => {
					return item.emplId == current_user.emplId;
				})
				if(arr.length == 0){
					this.selected_user.unshift(current_user);
				}
				
				this.pickedUsers = users.map(item => {
					return item.emplId;
				})
			},
			//提交预约会议
			confirmFn(){
				let arg = {
					meeting_title:this.title,
					meeting_room_ids:this.room_id,
					start_time:this.start_time,
					end_time:this.end_time,
					notice_type:this.notice_type_id,
					meeting_level:this.meeting_level_id,
					remark:this.remark,
					is_chat_notice:this.is_chat_notice
				}
				let user_ids = this.selected_user.map(item => {
					return item.emplId
				})
				arg['user_ids'] = user_ids.join(',');
				resource.addMeetingPost(arg).then(res => {
					if(res.data.code == 1){
						this.$toast(res.data.msg);
						this.$router.go(-1);
					}else{
						this.$toast(res.data.msg);
					}
				})
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
.textarea{
	border: none;
	outline: none;
	width: 100%;
}
.bottom_content{
	height: 80px;
	.over_button{
		width: 311px;
		text-align:center;
		height: 45px;
		line-height: 45px;
		background: #6670FD;
		border-radius: 23px;
	}
}

</style>