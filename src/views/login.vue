<template>
  <div class="login">
    <template v-if="user.id">
      <p>您已登录,若要更换账号,请退出重新登录.</p>
      <p><span>{{num}}</span>秒后返回首页</p>
    </template>
    <template v-else>
      <v-header head="登录"></v-header>
      <div class="login-box">
        <input type="text" v-model="accessToken" placeholder="access token">
        <div class="login-btn" @click="login">登 录</div>
      </div>
      <v-alert :text="message" :show="show"></v-alert>
    </template>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {mapState} from 'vuex'
  import vHeader from '../components/v-header'
  import vAlert from '../components/v-alert'

  export default {
    name: "login",
    components: {
      vHeader, vAlert
    },
    data() {
      return {
        show: false,
        message: '',
        accessToken: '',
        num: 3
      }
    },
    computed: {
      ...mapState(['user'])
    },
    created() {
      if (this.user.id) {
        var timer = null
        clearInterval(timer)
        timer = setInterval(() => {
          this.num--
          if (this.num === 0) {
            clearInterval(timer)
            this.$router.push('/')
          }
        }, 1000)
      }
    },
    methods: {
      login() {
        var url = `https://cnodejs.org/api/v1/accesstoken`
        if (!this.accessToken) {
          this.tip('access token不能为空')
        } else {
          $.post(url, {
            accesstoken: this.accessToken.trim()
          }).then((res) => {
            if (res.success) {
              var user = {
                id: res.id,
                name: res.loginname,
                avatar: res.avatar_url,
                accessToken: this.accessToken.trim()
              }
              // 本地记录记录信息
              window.localStorage.user = JSON.stringify(user)
              // 存储到vuex中
              this.$store.dispatch('setUser', user)

              var path = this.$route.query.origin ? decodeURIComponent(this.$route.query.origin) : "/"
              this.$router.push(path)
            }
          }).catch((e) => {
            this.tip(e.responseJSON.error_msg)
          })
        }
      },
      tip(message) {
        var timer = null
        clearTimeout(timer)
        this.message = message
        this.show = true
        timer = setTimeout(() => {
          this.show = false
        }, 2000)
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";

  .login {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f0f0f0;
    p {
      text-align: center;
      margin-top: 10px;
      font-size: 16px;
    }
    .login-box {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      /*height: 88px;*/
      /*background: red;*/
      input[type=text] {
        width: 100%;
        height: 44px;
        padding: 0 10px;
        border-radius: 4px;
      }
      .login-btn {
        margin-top: 10px;
        height: 44px;
        border-radius: 4px;
        background: $color-theme;
        text-align: center;
        line-height: 44px;
        font-size: 16px;
        color: #fff;
      }
    }
  }
</style>
