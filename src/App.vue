<template>
  <div id="app" class="container page_b">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  // import * as dd from 'dingtalk-jsapi';
  // import resource from './api/resource.js'
  export default {
    name: 'app',
    created(){
      this.$router.push('/convention')
      // this.$store.commit('setUserInfo',{user_type:1,user_name:'哈哈哈'});
      // this.$router.replace('/yyzy_index');
      //获取钉钉鉴权信息
      // this.getConfig();
    },
    methods:{
      
    }
  }
</script>

<style>

</style>
