<template>
  <div class="message">
    <v-header head="消息"></v-header>
    <ul class="tab">
      <li v-for="(item,index) in tab"
          :class="{current:currentIndex === index}"
          @click="switchTab(index)"
      >{{item}}
      </li>
    </ul>
    <template v-if="message.length">
      <ul class="message-list" v-if="message[currentIndex].length">
        <li v-if="currentIndex === 0 && message[0].length">
          <button class="mark" @click="markAll">全部标记为已读</button>
        </li>
        <li v-for="item in message[currentIndex]">
          <div class="base">
            <router-link :to="`/user/${item.author.loginname}`">
              <img :src="item.author.avatar_url" width="40" height="40" class="avatar">
            </router-link>
            <div class="center">
              <span class="name">{{item.author.loginname}}</span>
              <button class="mark" v-if="!item.has_read" @click="markOne(item)">标记为已读</button>
            </div>
            <time>{{getLastTime(item.reply.create_at)}}</time>
          </div>
          <div class="markdown-body content" v-html="item.reply.content"></div>
          <router-link :to="`/topic/${item.topic.id}`">
            <h2 class="title">{{item.topic.title}}</h2>
          </router-link>
        </li>
      </ul>
      <div class="no-data" v-else>
        <i class="icon-no-data"></i>
        <p>暂无消息</p>
      </div>
    </template>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {mapState} from 'vuex'
  import {getLastTime} from '../common/js/utils'
  import vHeader from '../components/v-header'

  export default {
    name: "message",
    components: {
      vHeader
    },
    data() {
      return {
        tab: ['未读消息', '已读消息'],
        currentIndex: 0,
        message: []
      }
    },
    computed: {
      ...mapState(['user'])
    },
    created() {
      this.getLastTime = getLastTime
      this.getMessages()
    },
    methods: {
      getMessages() {
        var url = `https://cnodejs.org/api/v1/messages?accesstoken=${this.user.accessToken}&mdrender=true`

        $.get(url).then((res) => {
          // console.log(res)
          if (res.success) {
            this.message = [res.data.hasnot_read_messages, res.data.has_read_messages]
          }
        })
      },
      switchTab(index) {
        this.currentIndex = index
      },
      // 标记单个消息为已读
      markOne(item) {
        var url = `https://cnodejs.org/api/v1/message/mark_one/${item.id}`
        $.post(url, {
          accesstoken: this.user.accessToken
        }).then((res) => {
          if (res.success) {
            item.has_read = true
          }
        })
      },

      // 标记全部已读
      markAll() {
        var url = `https://cnodejs.org/api/v1/message/mark_all`
        $.post(url, {
          accesstoken: this.user.accessToken
        }).then((res) => {
          if (res.success) {
            this.message[0].forEach((item) => {
              item.has_read = true
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";
  @import "../common/scss/github-markdown.css";

  .message {
    padding-top: 44px;
    background: #fff;
    .tab {
      height: 42px;
      display: flex;
      align-items: center;
      margin-top: 5px;
      li {
        flex: 1;
        text-align: center;
        line-height: 40px;
        border-bottom: 2px solid #f0f0f0;
        &:last-child {
          border-left: $border;
        }
        &.current {
          color: $color-sub-theme;
          border-bottom-color: $color-sub-theme;
        }
      }
    }
    .message-list {
      margin: 0 15px;
      .mark {
        background: $color-theme;
        padding: 3px 5px;
        color: #fff;
        border-radius: 3px;
      }
      li {
        padding: 10px 0;
        border-bottom: $border;
        &:last-child {
          border-bottom: none;
        }
        .base {
          display: flex;
          .avatar {
            border-radius: 50%;
          }
          .center {
            flex: 1;
            margin-left: 10px;
            .name {
              font-weight: bold;
            }
          }
          time {
            font-size: 12px;
            color: $color-theme;
          }
        }
        .content {
          margin-top: 10px;
          font-size: 14px;
          color: #555;
          p {
            margin-bottom: 5px;
          }
          pre {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          img {
            max-width: 100%;
          }
        }
        .title {
          margin: 5px 0;
          padding: 5px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .no-data {
      padding: 20px;
      text-align: center;
      [class*=icon-] {
        font-size: 30px;
      }
    }
  }
</style>
