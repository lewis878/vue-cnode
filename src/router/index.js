import Vue from 'vue'
import Router from 'vue-router'

var index = () => import('../views/index')
var about = () => import('../views/about')
var message = () => import('../views/message')
var create = () => import('../views/create')
var edit = () => import('../views/edit')
var login = () => import('../views/login')
var topic = () => import('../views/topic')
var user = () => import('../views/user')
var myCollection = () => import('../views/my-collection')
var notFound = () => import('../views/404')


Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  },
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/message',
      name: 'message',
      component: message,
      meta: {requiresAuth: true}
    },
    {
      path: '/topic/create',
      name: 'create',
      component: create,
      meta: {requiresAuth: true}
    },
    {
      path: '/topic/:id/edit',
      name: 'edit',
      component: edit,
      meta: {requiresAuth: true}
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/topic/:id',
      name: 'topic',
      component: topic
    },
    {
      path: '/user/:loginname',
      name: 'user',
      component: user
    },
    {
      path: '/my-collection',
      name: 'my-collection',
      component: myCollection,
      meta: {requiresAuth: true}
    },
    {
      path: '/404',
      name: '404',
      component: notFound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
