import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './common/scss/index.scss'


Vue.config.productionTip = false


// 处理刷新后vuex被清空的问题
if (window.localStorage.user) {
  store.dispatch('setUser', JSON.parse(window.localStorage.user))
}

// 用户在未登录的情况下,点击需要登录的页面链接(create,message,edit,my-collection)
// 直接跳转登录,并记录要前往的页面路径
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.user.id) {
      // console.log(to.fullPath)
      next({
        path: '/login',
        query: {origin: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
