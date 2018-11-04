<template>
  <div class="loading">
    <div class="box">
      <img src="../common/image/loading.gif" width="40" height="40">
      <p>正在加载...</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "loading"
  }
</script>

<style lang="scss">
  @import "../common/scss/var";
  .loading{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .box{
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      p{
        margin-top: 5px;
      }
    }
  }
</style>
