<template>
	<div class="pl12 pr12 pt12">
		<img class="width-100 index_banner mb24" src="../static/index_banner.png">
		<div class="width-100 menu_item white_b flex ac mb14">
			<img class="menu_icon mr10" src="../static/yy_icon.png">
			<div class="text_color fw-500 f16">预约会议室</div>
		</div>
		<div class="width-100 menu_item white_b flex ac">
			<img class="menu_icon mr10" src="../static/record_icon.png">
			<div class="text_color fw-500 f16">会议室记录</div>
		</div>
	</div>
</template>
<script>
	export default{

	}
</script>
<style lang="less" scoped>
.index_banner{
	height: 128px;
}
.menu_item{
	height: 78px;
	box-shadow: 0px 4px 8px 0px #F2F7FF;
	border-radius: 8px;
	.menu_icon{
		width: 30px;
		height: 30px;
	}
}

</style>