<template>
  <div class="my-collection">
    <v-header head="我的收藏"></v-header>
    <ul class="collection-list" v-if="collection.length">
      <li v-for="item in collection" @click="goTopic(item.id)">
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
  </div>
</template>

<script>
  import $ from 'jquery'
  import {getLastTime, getTagInfo} from '../common/js/utils'
  import {mapState} from 'vuex'

  import vHeader from '../components/v-header'
  import tag from '../components/tag'

  export default {
    name: "my-collection",
    components: {
      vHeader, tag
    },
    data() {
      return {
        collection: []
      }
    },
    computed: {
      ...mapState(['user'])
    },
    created() {
      this.getLastTime = getLastTime
      this.getTagInfo = getTagInfo

      this.getCollection()
    },
    updated(){
      this.lazyLoad()
      $(window).scroll(this.lazyLoad)
    },
    methods: {
      getCollection() {
        var url = `https://cnodejs.org/api/v1/topic_collect/${this.user.name}`
        $.get(url).then((res) => {
          if (res.success) {
            this.collection = res.data
          }
        })
      },
      // 图片懒加载
      lazyLoad() {
        $('.collection-list .avatar').each(function () {
          var totalHeight = window.pageYOffset + window.innerHeight
          if (this.offsetTop <= totalHeight) {
            this.src = $(this).attr('data-src')
          }
        })
      },
      goUser(loginname) {
        this.$router.push(`/user/${loginname}`)
      },
      goTopic(topicId) {
        this.$router.push(`/topic/${topicId}`)
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";

  .my-collection {
    padding-top: 44px;
    background: #fff;
    .collection-list {
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
