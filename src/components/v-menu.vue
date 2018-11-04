<template>
  <div class="menu">
    <div class="user-info">
      <!--未登录-->
      <router-link v-if="!user.id" to="/login" class="login-no">
        <i class="icon-login"></i>
        <span>登录</span>
      </router-link>
      <!--已登录-->
      <div v-else class="login-yes">
        <router-link :to="`/user/${user.name}`" class="base">
          <img :src="user.avatar" width="40" height="40" class="avatar">
          <span class="name">{{user.name}}</span>
          <i class="icon-next"></i>
        </router-link>
        <div class="ctrl">
          <router-link to="/my-collection" class="collect">我的收藏</router-link>
          <button class="logout" @click="logout">退出登录</button>
        </div>
      </div>
    </div>
    <ul class="menu-list" ref="menu-list">
      <router-link tag="li" v-for="(item,index) in menuList" :key="index" :to="item.to" exact>
        <a>
          <i :class="`icon-${item.name}`"></i>
          <span class="text">{{item.text}}</span>
          <span v-if="index===6 && num>0" class="message-tip">{{num}}</span>
        </a>
      </router-link>
    </ul>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {menuList} from '../common/js/utils'
  import {mapState} from 'vuex'

  export default {
    name: "v-menu",
    data() {
      return {
        num: 0
      }
    },
    computed: {
      ...mapState(['user'])
    },
    created() {
      this.menuList = menuList
      this.getNum()
    },
    mounted() {
      $('.menu').on('touchmove', function (e) {
        e.preventDefault()
      })
    },
    methods: {
      logout() {
        window.localStorage.removeItem('user')
        this.$store.dispatch('setUser', {})
        this.$router.push('/')
      },
      // 获取未读消息数
      getNum() {
        if (!this.user.id) {
          return
        }
        var url = `https://cnodejs.org/api/v1/message/count?accesstoken=${this.user.accessToken}`
        $.get(url).then((res) => {
          if (res.success) {
            this.num = res.data
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";

  .menu {
    &.show {
      left: 0;
    }
    position: fixed;
    z-index: 100;
    top: 0;
    left: -200px;
    bottom: 0;
    width: 200px;
    background: #fff;
    transition: left 0.3s ease;
    .user-info {
      padding: 15px;
      .login-no {
        display: flex;
        align-items: center;
        .icon-login {
          font-size: 24px;
          color: $color-sub-theme;
        }
        span {
          margin-left: 10px;
          font-size: 16px;
        }
      }
      .login-yes {
        .base {
          display: flex;
          align-items: center;
          .avatar {
            border-radius: 50%;
          }
          .name {
            flex: 1;
            margin: 0 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .ctrl {
          display: flex;
          align-items: center;
          margin-top: 10px;
          padding-top: 10px;
          border-top: $border;
          .collect, .logout {
            flex: 1;
            padding: 8px 10px;
            background: $color-theme;
            color: #fff;
            font-size: 12px;
            text-align: center;
            border-radius: 4px;
          }
          .logout {
            margin-left: 10px;
            cursor: pointer;
            background: $color-sub-theme;
          }

        }
      }
    }
    .menu-list {
      border-top: $border;
      padding-top: 10px;
      margin: 0 15px;
      li {
        &:nth-last-child(2) {
          border-top: $border;
        }
        &.active a {
          color: $color-theme;
        }
        a {
          display: flex;
          align-items: center;
          padding: 10px 0;
          [class*=icon-] {
            margin-right: 30px;
          }
          .text {
            font-weight: bold;
          }
        }
        .message-tip {
          margin-left: 10px;
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          background: $color-sub-theme;
          border-radius: 50%;
          color: #fff;
        }
      }
    }
  }


</style>
