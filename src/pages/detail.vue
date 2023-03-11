<template>
	<div class="container pt3 pb3 text_color flex fc">
		<div class="flex-1 scroll-y hide_scrollbar">
			<div class="white_b pl15 pr15 pb12 mb5">
				<div class="title_input f16 fw-500">
					{{title}}
				</div>
				<div class="flex ac jsb">
					<div class="f14 fw-500">
						<div>{{view_start_date}}</div>
						<div>{{view_start_hm}}</div>
					</div>
					<img class="right_arrow" src="../static/right_arrow.png">
					<div class="f14 fw-500">
						<div>{{view_end_date}}</div>
						<div>{{view_end_hm}}</div>
					</div>
				</div>
			</div>
			<div class="white_b mb5">
				<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500">
					<div>组织人：{{admin_name}}</div>
					<div>{{meeting_level_name}}</div>
				</div>
				<div class="menu_item flex ac jsb pl15 pr15 f14 fw-500" @click="$router.push(`/sign_list?meeting_id=${meeting_id}`)">
					<div>邀请{{selected_user.length}}人,{{is_sign_arr.length}}人签到</div>
					<img class="item_right_arrow" src="../static/right_arrow.png">
				</div>
				<div class="menu_item flex ac pl15 pr15 f14 fw-500">
					<div>会议室：{{room_name}}</div>
				</div>
				<div class="menu_item flex ac pl15 pr15 f14 fw-500">
					<div>提醒时间：{{notice_type_name}}</div>
				</div>
				<div class="pl15 pr15 pt15 pb15 f14 fw-500 break_all">
					会议描述：{{remark}}
				</div>
			</div>
			<!-- 会议纪要 -->
			<div class="pl15 pr15 pt15 pb15 white_b">
				<div class="f16 fw-500 mb10">会议纪要</div>
				<!-- 可编辑 -->
				<div v-if="edit_status == '1'">
					<div class="upload_box">
						<div class="custom_button white_color f12">添加附件</div>
						<input type="file" ref="fileUpload" class="upload_file" @change="uploadFile">
					</div>
					<div class="flex ac mt10" v-for="(item,index) in file_list">
						<img class="link_icon mr4" src="../static/link_icon.png">
						<div class="f14 flex-1 text-overflow">{{item.split('/')[1]}}</div>
						<img class="delete_icon" src="../static/delete_icon.png"  @click="deleteFile(index)">
					</div>
					<textarea class="record_input f14 mt10" v-model="meeting_minutes" placeholder="请输入会议记录"></textarea>
				</div>
				<!-- 不可编辑 -->
				<div v-else>
					<div class="f14">{{meeting_minutes}}</div>
					<div class="mt10" v-for="item in file_list">
						<div class="flex ac">
							<img class="file_icon mr10" src="../static/file_icon.png">
							<div class="f14 flex-1 text-overflow">{{item.split('/')[1]}}</div>
						</div>
						<div class="download white_color f12 mt10" @click="downLoad(item)">下载</div>
					</div>
					<div class="f16 flex ac mt15">
						<div class="fw-500">会议记录人：</div>
						<div>{{admin_name}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="bottom_content flex ac jc" v-if="edit_status == '1'">
			<div class="over_button white_color f15 fw-600" @click="saveFn">保存</div>
		</div>
	</div>
</template>
<script>
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				meeting_id:"",			//会议ID
				edit_status:"",			//是否可编辑（1:是 0:否）
				title:"",				//会议标题
				view_start_date:"",		//显示的开始时间上面
				view_start_hm:"",		//显示的开始时间下面
				view_end_date:"",		//显示的结束时间上面
				view_end_hm:"",			//显示的结束时间下面
				admin_name:"",			//组织人
				meeting_level_name:"",		//选中的会议级别name
				room_name:"",				//选中的会议室name
				notice_type_name:"",		//选中的通知类型name
				remark:"",					//描述内容
				is_chat_notice:0,			//是否单聊通知
				selected_user:[],			//已选中的用户
				is_sign_arr:[],				//已签到人数
				file_list:[],				//附件列表
				meeting_minutes:"",			//填写的会议纪要
			}
		},
		created(){
			this.meeting_id = this.$route.query.meeting_id;
			//获取会议详情
			this.getMeetingDetail();
		},
		computed:{
			//图片前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		methods:{
			//获取会议详情
			getMeetingDetail(){
				resource.meetingDetail({meeting_id:this.meeting_id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.edit_status = data.edit_status;
						this.title = data.meeting_title;
						//设置开始时间（展示）
						this.setStartDate(data.start_time);
						//设置开始时间（展示）
						this.setEndDate(data.end_time);
						this.admin_name = data.admin_name;
						this.meeting_level_name = data.meeting_level_name;
						this.room_name = data.meeting_room_name;
						this.notice_type_name = data.notice_type_name;
						this.selected_user = data.user_list;
						this.is_sign_arr = this.selected_user.filter(item => {
							return item.status == 1;
						})
						this.remark = data.remark;
						this.meeting_minutes = data.meeting_minutes;
						this.file_list = data.meeting_files;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
			//设置开始时间（展示）
			setStartDate(date){
				this.view_start_date = this.getYMD(date) + ' ' + this.getWeek(date);
				this.view_start_hm = this.getHM(date);
			},
			//设置结束时间（展示）
			setEndDate(date){
				this.view_end_date = this.getYMD(date) + ' ' + this.getWeek(date);
				this.view_end_hm = this.getHM(date);
			},
			//上传文件
			uploadFile(){
				if (this.$refs.fileUpload.files.length > 0) {
					let files = this.$refs.fileUpload.files;
					let arg = {
						image:files[0],
						type:'3'
					}
					resource.uploadFile(arg).then(res => {
						if(res.data.code == 1){
							let file = res.data.data;
							this.file_list.push(file.urls);
							this.$toast(res.data.msg);
						}else{
							this.$toast(res.data.msg);
						}
					})
				}
			},
			//删除文件
			deleteFile(index){
				this.file_list.splice(index,1);
			},
			//点击保存提交会议纪要
			saveFn(){
				let arg = {
					meeting_id:this.meeting_id,
					meeting_files:this.file_list.join(','),
					meeting_minutes:this.meeting_minutes
				}
				resource.updateMinutes(arg).then(res => {
					if(res.data.code == 1){
						this.$toast(res.data.msg);
						this.$router.go(-1);
					}else{
						this.$toast(res.data.msg);
					}
				})
			},
			//点击下载会议附件
			downLoad(link){
				window.open(this.domain  + link);
			}
		}
	}
</script>
<style lang="less" scoped>
.title_input{
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
.upload_box{
	position: relative;
	width: 80px;
	height: 24px;
	.custom_button{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #6670FD;
		width: 80px;
		text-align: center;
		height: 24px;
		line-height: 24px;
		border-radius: 17px;
	}
	.upload_file{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
}
.download{
	background-color: #6670FD;
	width: 80px;
	text-align: center;
	height: 24px;
	line-height: 24px;
	border-radius: 17px;
}
.file_icon{
	width: 17px;
	height: 20px;
}
.link_icon{
	width: 15px;
	height: 13px;
}
.delete_icon{
	width: 12px;
	height: 14px;
}
.record_input{
	box-sizing: border-box;
	padding: 8px;
	border: none;
	outline: none;
	width: 100%;
	height: 172px;
	background: #FAFAFA;
}
</style>