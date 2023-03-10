import Vue from 'vue'
import Router from 'vue-router'

const index = resolve=>System.import('@/pages/index')
const convention = resolve=>System.import('@/pages/convention')
const create_metting = resolve=>System.import('@/pages/create_metting')
const record = resolve=>System.import('@/pages/record')
const detail = resolve=>System.import('@/pages/detail')
const sign_list = resolve=>System.import('@/pages/sign_list')

Vue.use(Router);

const router = new Router({
	routes: [
	{
		path: '/index',
		name:"首页",
		component: index
	},
	{
		path: '/convention',
		name:"预约会议室",
		component: convention
	},
	{
		path: '/create_metting',
		name:"新建日程",
		component: create_metting
	},
	{
		path: '/record',
		name:"会议记录",
		component: record
	},
	{
		path: '/detail',
		name:"会议详情",
		component: detail
	},
	{
		path: '/sign_list',
		name:"签到详情",
		component: sign_list
	},
	]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

export default router;
