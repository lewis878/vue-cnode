<template>
  <div class="not-found">
    <p>404 not found</p>
    <p>{{num}}秒后返回首页</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        num: 3
      }
    },
    mounted() {
      var timer = null
      clearInterval(timer)
      timer = setInterval(() => {
        this.num--
        if (!this.num) {
          clearInterval(timer)
          this.$router.push('/')
        }
      }, 1000)
    }
  }
</script>

<style lang="scss">
  .not-found {
    font-size: 16px;
    text-align: center;
    p {
      margin-top: 10px;
    }
  }
</style>
