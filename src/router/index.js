import Vue from 'vue'
import Router from 'vue-router'

const index = resolve=>System.import('@/pages/index')
const convention = resolve=>System.import('@/pages/convention')
const create_metting = resolve=>System.import('@/pages/create_metting')

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
	]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

export default router;
