<template>
  <div class="index">
    <v-header :head="headText"></v-header>
    <ul class="topic-list" v-if="topics.length">
      <li v-for="item in topics" @click="goTopic(item.id)">
        <h2 class="title">
          <tag :type="getTagInfo(item).className" :text="getTagInfo(item).text"></tag>
          <span class="text">{{item.title}}</span>
        </h2>
        <div class="content">
          <img src="../common/image/default_avatar.jpeg" :data-src="item.author.avatar_url" width="40" height="40"
               class="avatar" @click.stop="goUser(item.author.loginname)">
          <div class="info">
            <p>
              <span class="name">{{item.author.loginname}}</span>
              <span><b>{{item.reply_count}}</b> /{{item.visit_count}}</span>
            </p>
            <p>
              <time>{{getLastTime(item.create_at)}}</time>
              <time>{{getLastTime(item.last_reply_at)}}</time>
            </p>
          </div>
        </div>
      </li>
    </ul>
    <load-more v-if="canLoadData&&topics.length"></load-more>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {getLastTime, getTagInfo, throttle} from '../common/js/utils'

  import vHeader from '../components/v-header'
  import loadMore from '../components/load-more'
  import tag from '../components/tag'


  export default {
    name: "index",
    components: {
      vHeader,
      loadMore,
      tag
    },
    data() {
      return {
        headText: '首页',
        topics: [],
        tab: 'all',
        page: 1,
        canLoadData: true
      }
    },
    created() {
      this.getLastTime = getLastTime
      this.getTagInfo = getTagInfo

      var schema = ['all', 'good', 'share', 'ask', 'job', 'dev']
      this.tab = this.$route.query.tab || 'all'
      if (!schema.includes(this.tab)) {
        return this.$router.push('/404')
      }
      this.setHeadText(this.tab)

      if (window.sessionStorage.tab && window.sessionStorage.tab === this.tab) {
        this.topics = JSON.parse(window.sessionStorage.topics)
        this.page = Number(window.sessionStorage.page)
        this.canLoadData = window.sessionStorage.canLoadData === 'true'
        window.scrollTo(0, Number(window.sessionStorage.scrollTop))
        return
      }
      this.getTopics(this.tab, this.page)
    },
    mounted() {
      this.lazyLoad()
      $(window).scroll(throttle(this.getScrollData, 300, 500))
      $(window).scroll(this.lazyLoad)
    },
    updated() {
      this.lazyLoad()
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'topic') {
        window.sessionStorage.topics = JSON.stringify(this.topics)
        window.sessionStorage.tab = this.tab
        window.sessionStorage.page = this.page
        window.sessionStorage.canLoadData = this.canLoadData
        window.sessionStorage.scrollTop = window.pageYOffset
      }
      next()
    },
    beforeRouteEnter(to, from, next) {
      if (from.name !== 'topic') {
        window.sessionStorage.removeItem('topics')
        window.sessionStorage.removeItem('tab')
        window.sessionStorage.removeItem('page')
        window.sessionStorage.removeItem('canLoadData')
        window.sessionStorage.removeItem('scrollTop')
      }
      next()
    },
    methods: {
      setHeadText(tab) {
        switch (tab) {
          case 'all':
            this.headText = '首页'
            break
          case 'good':
            this.headText = '精华'
            break
          case 'ask':
            this.headText = '问答'
            break
          case 'share':
            this.headText = '分享'
            break
          case 'job':
            this.headText = '招聘'
            break
          case 'dev':
            this.headText = '测试'
            break
        }
      },
      getTopics(tab, page) {
        var url = `https://cnodejs.org/api/v1/topics?tab=${tab}&page=${page}&limit=20&mdrender=true`
        $.get(url).then((res) => {
          // console.log(res)
          if (res.success && res.data.length) {
            this.topics = this.topics.concat(res.data)
          } else {
            this.canLoadData = false
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      // 图片懒加载
      lazyLoad() {
        $('.topic-list .avatar').each(function () {
          var totalHeight = window.pageYOffset + window.innerHeight
          if (this.offsetTop <= totalHeight) {
            this.src = $(this).attr('data-src')
          }
        })
      },
      // 上拉加载
      getScrollData() {
        var totalHeight = window.pageYOffset + window.innerHeight
        if (document.documentElement.offsetHeight <= totalHeight + 200) {
          this.getTopics(this.tab, ++this.page)
        }
      },
      goUser(loginname) {
        this.$router.push(`/user/${loginname}`)
      },
      goTopic(topicId) {
        this.$router.push(`/topic/${topicId}`)
      }
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'index') {
          var tab = to.query.tab || 'all'
          this.tab = tab
          this.topics = []
          this.page = 1
          this.getTopics(this.tab, this.page)
          this.setHeadText(tab)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";

  .index {
    padding-top: 44px;
    background: #fff;
    .topic-list {
      li {
        margin: 0 15px;
        padding: 10px 0;
        border-bottom: $border;
        &:last-child {
          border-bottom: none;
        }
        .title {
          display: flex;
          align-items: center;
          .text {
            margin-left: 10px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: bold;
            font-size: 16px;
          }
        }
        .content {
          display: flex;
          align-items: center;
          margin-top: 10px;
          .avatar {
            border-radius: 50%;
          }
          .info {
            margin-left: 10px;
            flex: 1;
            p {
              display: flex;
              align-items: center;
              justify-content: space-between;
              span > b {
                color: $color-theme;
              }
            }
          }
        }
      }
    }
  }
</style>
