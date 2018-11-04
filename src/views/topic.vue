<template>
  <div class="topic">
    <v-header head="主题"></v-header>
    <template v-if="topic.id">
      <h2 class="title">{{topic.title}}</h2>
      <div class="author-info">
        <router-link :to="`/user/topic.author.loginname`">
          <img :src="topic.author.avatar_url" width="40" height="40" class="avatar">
        </router-link>
        <div class="center">
          <div class="base">
            <span class="name">{{topic.author.loginname}}</span>
            <span class="name">{{getLastTime(topic.create_at)}}</span>
          </div>
          <router-link :to="`/topic/${topic.id}/edit`" v-if="topic.author.loginname === user.name" class="edit">编辑
          </router-link>
        </div>
        <div class="right">
          <button class="collect"
                  :class="{cancel:topic.is_collect}"
                  v-if="user.id"
                  @click="collectTopic"
          >{{topic.is_collect? '取消收藏':'收藏'}}
          </button>
          <div class="visit">
            <tag :type="getTagInfo(topic).className" :text="getTagInfo(topic).text"></tag>
            <span>{{topic.visit_count}}次浏览</span>
          </div>
        </div>
      </div>
      <div class="topic-content markdown-body" v-html="topic.content"></div>
      <div class="comment-wrapper" v-if="user.id">
        <div class="comment">
          <textarea id="textarea" placeholder="写下你的评论..." v-model="commentContent"></textarea>
          <div class="ctrl">
            <span class="cancel" @click="cancelComment">取消</span>
            <button class="send" @click="comment(0,commentContent)">发送</button>
          </div>
        </div>
      </div>
      <template v-if="topic.replies.length">
        <h3><b>{{topic.replies.length}}</b> 回复</h3>
        <ul class="reply-list">
          <li v-for="(item,index) in topic.replies">
            <div class="base">
              <router-link :to="`/user/${item.author.loginname}`">
                <img src="../common/image/default_avatar.jpeg" :data-src="item.author.avatar_url" width="40" height="40"
                     class="avatar">
              </router-link>
              <div class="center">
                <p class="author-name">{{item.author.loginname}}</p>
                <time>{{getLastTime(item.create_at)}}</time>
              </div>
              <span class="floor">{{index+1}}楼</span>
            </div>
            <div class="markdown-body content" v-html="item.content"></div>
            <div class="action">
              <span class="num" :class="{is_uped:item.is_uped}">{{item.ups.length?item.ups.length:''}}</span>
              <i class="icon-awesome" :class="{is_uped:item.is_uped}" @click="ups(item)"></i>
              <i class="icon-reply" @click="replyOthers(item)"></i>
            </div>
            <transition name="comment">
              <div class="comment between" v-if="reply_id === item.id">
                <textarea placeholder="写下你的回复..." v-model="replyContent"></textarea>
                <div class="ctrl">
                  <span class="cancel" @click="cancelReplyOthers">取消</span>
                  <button class="send" @click="comment(item.id,replyContent)">发送</button>
                </div>
              </div>
            </transition>
          </li>
        </ul>
      </template>
      <p v-else class="no-reply">暂无回复</p>
    </template>
    <v-alert :text="message" :show="show"></v-alert>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {mapState} from 'vuex'
  import {getLastTime, getTagInfo} from '../common/js/utils'

  import vHeader from '../components/v-header'
  import tag from '../components/tag'
  import vAlert from '../components/v-alert'

  export default {
    name: "topic",
    components: {
      vHeader,
      tag,
      vAlert
    },
    data() {
      return {
        topic: {},
        commentContent: '',
        replyContent: '',
        show: false,
        message: '',
        reply_id: 0
      }
    },
    computed: {
      ...mapState(['user'])
    },
    created() {
      this.getLastTime = getLastTime
      this.getTagInfo = getTagInfo
      this.getTopicDetail()
    },
    updated() {
      $('#textarea').focus(() => {
        this.reply_id = 0
      })
      this.lazyLoad()
      $(window).scroll(this.lazyLoad)
      //解决iOS上切换路由时,出现白屏的问题
      window.scrollTo(0, 0)
    },
    methods: {
      // 获取主题详情
      getTopicDetail() {
        var topicId = this.$route.params.id
        var url = `https://cnodejs.org/api/v1/topic/${topicId}?mdrender=true&accesstoken=${this.user.accessToken}`
        $.get(url).then((res) => {
          // console.log(res)
          if (res.success) {
            this.topic = res.data
          }
        }).catch(() => {
          this.$router.push('/404')
        })
      },
      // 图片懒加载
      lazyLoad() {
        $('.reply-list .avatar').each(function () {
          var totalHeight = window.pageYOffset + window.innerHeight
          if (this.offsetTop <= totalHeight) {
            this.src = $(this).attr('data-src')
          }
        })
      },
      // 收藏主题和取消收藏
      collectTopic() {
        if (!this.topic.is_collect) {
          const url = `https://cnodejs.org/api/v1/topic_collect/collect`
          $.post(url, {
            accesstoken: this.user.accessToken,
            topic_id: this.$route.params.id
          }).then((res) => {
            if (res.success) {
              this.topic.is_collect = true
            }
          })
        } else {
          const url = `https://cnodejs.org/api/v1/topic_collect/de_collect`
          $.post(url, {
            accesstoken: this.user.accessToken,
            topic_id: this.$route.params.id
          }).then((res) => {
            if (res.success) {
              this.topic.is_collect = false
            }
          })
        }
      },

      // 发表评论
      comment(reply_id, content) {
        var topicId = this.$route.params.id
        var url = `https://cnodejs.org/api/v1/topic/${topicId}/replies`

        if (!content) {
          return this.tip('[评论/回复]内容不能为空')
        }

        $.post(url, {
          accesstoken: this.user.accessToken,
          content: content.trim(),
          reply_id
        }).then((res) => {
          if (res.success) {
            this.tip('[评论/回复]发表成功')
            setTimeout(() => {
              window.location.reload(true)
            }, 2000)
          }
        }).catch((e) => {
          this.tip(e.responseJSON.error_msg)
        })
      },
      // 取消评论
      cancelComment() {
        this.commentContent = ''
      },

      // 回复别人
      replyOthers(item) {
        if (!this.user.id) {
          return this.$router.push(`/login?origin=${this.$route.fullPath}`)
        }

        this.reply_id = item.id
        this.replyContent = `@${item.author.loginname} `
      },
      // 取消回复别人
      cancelReplyOthers() {
        this.reply_id = 0
        this.replyContent = ''
      },

      // 为评论点赞
      ups(item) {
        if (!this.user.id) {
          return this.$router.push(`/login?origin=${this.$route.fullPath}`)
        }

        var url = `https://cnodejs.org/api/v1/reply/${item.id}/ups`

        $.post(url, {
          accesstoken: this.user.accessToken
        }).then((res) => {
          // console.log(item)
          if (res.success) {
            if (res.action === 'up') {
              // 由于 JavaScript 的限制，这里不能使用item.ups.length++,
              // 即不能直接操作数组的长度,也不能利用索引直接设置一个项的值
              item.ups.push('up')
              item.is_uped = true
            } else if (res.action === 'down') {
              item.ups.pop()
              item.is_uped = false
            }
          }
        })
      },

      tip(message) {
        var timer = null
        clearTimeout(timer)
        this.show = true
        this.message = message
        timer = setTimeout(() => {
          this.show = false
        }, 2000)
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";
  @import "../common/scss/github-markdown.css";

  .topic {
    padding-top: 44px;
    background: #fff;
    .title {
      margin: 10px 15px;
      padding: 5px;
      background: #f0f0f0;
      border-radius: 4px;
      font-size: 18px;
      font-weight: bold;
    }
    .author-info {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      font-size: 12px;
      .avatar {
        border-radius: 50%;
      }
      .center {
        flex: 1;
        margin-left: 10px;
        display: flex;
        align-items: center;
        .base {
          span {
            display: block;
          }
        }
        .edit {
          margin-left: 10px;
          padding: 0 10px;
          height: 42px;
          line-height: 42px;
          background: $color-sub-theme;
          border-radius: 4px;
          color: #fff;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .collect {
          &.cancel {
            background: #f0f0f0;
            color: #555;
          }
          padding: 0 10px;
          height: 42px;
          line-height: 42px;
          background: $color-theme;
          border-radius: 4px;
          color: #fff;
          font-size: 12px;
          cursor: pointer;
        }
        .visit {
          flex: 1;
          margin-left: 10px;
          span {
            display: block;
            text-align: center;
          }
        }
      }
    }
    .topic-content {
      margin: 10px 15px;
      padding-top: 10px;
      color: #555;
      pre {
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
      }
    }
    .comment-wrapper {
      margin: 10px 15px;
    }
    > h3 {
      padding: 5px 0;
      margin: 0 15px;
      font-size: 16px;
      border-bottom: $border;
      b {
        color: $color-theme;
      }
    }
    .reply-list {
      margin: 0 15px;
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
            margin-left: 10px;
            flex: 1;
            line-height: 20px;
            .author-name {
              font-weight: bold;
            }
            time {
              font-size: 12px;
            }
          }
          .floor {
            font-size: 12px;
          }
        }
        .content {
          margin-top: 10px;
          font-size: 14px;
          color: #555;
          img {
            max-width: 100%;
          }
          p {
            margin-bottom: 0;
          }
          pre {
            overflow-x: scroll;
            -webkit-overflow-scrolling: touch;
          }
        }
        .action {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          [class*=icon-] {
            font-size: 20px;
          }
          .icon-awesome {
            margin: 0 20px 0 2px;
          }
          .is_uped {
            color: $color-theme;
          }
        }
      }
    }
    .no-reply {
      padding: 10px 15px;
      text-align: center;
    }
    .comment {
      &.between {
        margin-top: 10px;
      }
      textarea {
        width: 100%;
        display: block;
        height: 150px;
        border: 1px solid $color-theme;
        border-radius: 4px;
        resize: none;
        padding: 8px;
        background: #f5f5f5;
      }
      .ctrl {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 10px;
        .cancel {
          margin-right: 20px;
        }
        .send {
          padding: 8px 20px;
          background: $color-theme;
          color: #fff;
          line-height: 1;
          border-radius: 4px;
        }
      }
    }
  }

  .comment-enter-active, .comment-leave-active {
    transition: opacity 0.3s ease;
  }

  .comment-enter, .comment-leave-to {
    opacity: 0;
  }
</style>
