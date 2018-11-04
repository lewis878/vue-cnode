<template>
  <div class="user">
    <v-header head="用户详情"></v-header>
    <template v-if="user.loginname">
      <div class="base">
        <div class="bg" :style="{backgroundImage: `url(${user.avatar_url})`}"></div>
        <div class="bg-mask"></div>
        <div class="content">
          <img :src="user.avatar_url" width="100" height="100" class="avatar">
          <p>{{user.loginname}}</p>
          <div class="info">
            <span>注册时间: <b>{{getLastTime(user.create_at)}}</b></span>
            <span>积分: <b>{{user.score}}</b></span>
          </div>
        </div>
      </div>
      <ul class="tab">
        <li v-for="(item,index) in tab"
            :class="{current:currentIndex === index}"
            @click="switchTab(index)"
        >{{item}}
        </li>
      </ul>
      <ul class="recent-list">
        <li v-for="item in recent[currentIndex]">
          <router-link :to="`/user/${item.author.loginname}`">
            <img :src="item.author.avatar_url" width="40" height="40" class="avatar">
          </router-link>
          <router-link :to="`/topic/${item.id}`" class="info">
            <h2 class="title">{{item.title}}</h2>
            <p>
              <span>{{item.author.loginname}}</span>
              <time>{{getLastTime(item.last_reply_at)}}</time>
            </p>
          </router-link>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {getLastTime} from '../common/js/utils'
  import vHeader from '../components/v-header'

  export default {
    name: "user",
    components: {
      vHeader
    },
    data() {
      return {
        user: {},
        tab: ['最近创建的话题', '最近参与的话题'],
        currentIndex: 0,
        recent: []
      }
    },
    created() {
      this.getLastTime = getLastTime
      this.getUserInfo()
    },
    methods: {
      getUserInfo() {
        var name = this.$route.params.loginname
        var url = `https://cnodejs.org/api/v1/user/${name}`
        $.get(url).then((res) => {
          if (res.success) {
            this.user = res.data
            this.recent = [res.data.recent_topics, res.data.recent_replies]
          }
        }).catch(()=>{
          this.$router.push('/404')
        })
      },
      switchTab(index) {
        this.currentIndex = index
      }
    },
    watch:{
      '$route'(to,from){
        if (to.name === 'user') {
          this.getUserInfo()
          window.scrollTo(0,0)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";

  .user {
    padding-top: 44px;
    background: #fff;
    .base {
      overflow: hidden;
      position: relative;
      .bg {
        height: 180px;
        background: center center no-repeat;
        background-size: cover;
        filter: blur(20px);
      }
      .bg-mask, .content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .bg-mask {
        background: rgba(0, 0, 0, 0.3);
      }
      .content {
        text-align: center;
        color: #d5d5d5;
        padding-top: 20px;
        .avatar {
          border-radius: 50%;
        }
        p {
          margin-top: 5px;
          margin-bottom: 5px;
          color: #fff;
          font-weight: bold;
        }
        .info {
          display: flex;
          align-items: center;
          span {
            flex: 1;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-child {
              border-left: 1px solid #d5d5d5;
            }
            b {
              color: #f0f0f0;
            }
          }
        }
      }

    }
    .tab {
      display: flex;
      align-items: center;
      li {
        &.current {
          color: $color-sub-theme;
          border-bottom-color: $color-sub-theme;
        }
        &:last-child {
          border-left: 2px solid #f0f0f0;
        }
        flex: 1;
        text-align: center;
        height: 42px;
        line-height: 40px;
        border-bottom: 2px solid #f0f0f0;
      }
    }
    .recent-list {
      margin: 0 15px;
      li {
        padding: 10px 0;
        border-bottom: $border;
        display: flex;
        align-items: center;
        &:last-child {
          border-bottom: none;
        }
        .avatar {
          border-radius: 50%;
        }
        .info {
          flex: 1;
          margin-left: 10px;
          min-width: 0;
          .title {
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p {
            margin-top: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            span {
              font-weight: bold;
            }
            time {
              color: $color-theme;
            }
          }
        }
      }
    }
  }
</style>
