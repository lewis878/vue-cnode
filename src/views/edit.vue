<template>
  <div class="edit">
    <v-header head="编辑主题"></v-header>
    <div class="line">
      <span>选择分类: </span>
      <select id="select-tab" v-model="tab">
        <option value="share">分享</option>
        <option value="ask">问答</option>
        <option value="job">招聘</option>
        <option value="dev">测试</option>
      </select>
      <button id="issue" @click="modifyIssue">提交</button>
    </div>
    <div class="title">
      <input type="text" v-model="title" placeholder="标题,字数10字以上">
    </div>
    <div class="content">
      <textarea v-model="content" placeholder="支持Markdown语法,请注意标记代码"></textarea>
    </div>
    <v-alert :show="show" :text="message"></v-alert>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {mapState} from 'vuex'

  import vHeader from '../components/v-header'
  import vAlert from '../components/v-alert'

  export default {
    name: "edit",
    components: {
      vHeader, vAlert
    },
    data() {
      return {
        show: false,
        message: '',
        title: '',
        tab: 'share',
        content: '',
        topic_id: this.$route.params.id
      }
    },
    computed: {
      ...mapState(['user'])
    },
    created() {
      this.getTopicDetail()
    },
    methods: {
      modifyIssue() {
        if (this.title.length <= 10) {
          this.tip('标题字数10字以上')
        } else if (!this.content.length) {
          this.tip('主题内容不能为空')
        } else {
          var url = `https://cnodejs.org/api/v1/topics/update`
          $.post(url, {
            accesstoken: this.user.accessToken,
            title: this.title,
            tab: this.tab,
            content: this.content,
            topic_id: this.topic_id
          }).then((res) => {
            if (res.success) {
              this.tip('主题修改成功')
              setTimeout(() => {
                this.$router.push(`/?tab=${this.tab}`)
              }, 2000)
            }
          }).catch(() => {
            this.tip('阿欧~,服务器抽风了!')
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
      },
      getTopicDetail() {
        var topicId = this.$route.params.id
        var url = `https://cnodejs.org/api/v1/topic/${topicId}?mdrender=false`
        $.get(url).then((res) => {
          // console.log(res)
          if (res.success) {
            this.title = res.data.title
            this.tab = res.data.tab
            this.content = res.data.content
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";

  .edit {
    background: #fff;
    padding-top: 44px;
    .line {
      margin: 10px 15px;
      display: flex;
      align-items: center;
      #select-tab {
        flex: 1;
        margin: 0 10px;
        padding-left: 30px;
        border: 1px solid $color-theme;
        height: 30px;
        border-radius: 4px;
      }
      #issue {
        padding: 5px 20px;
        background: $color-theme;
        color: #fff;
        border-radius: 4px;
      }
    }
    .title {
      margin: 20px 15px;
      border-top: $border;
      border-bottom: $border;
      input[type=text] {
        display: block;
        width: 100%;
        padding: 10px 0;
        font-weight: bold;
        font-style: italic;
      }
    }
    .content {
      margin: 0 15px;
      textarea {
        width: 100%;
        height: 400px;
        background: #f0f0f0;
        border-radius: 5px;
        border: 1px solid $color-theme;
        padding: 8px;
        resize: none;
      }
    }
  }
</style>
