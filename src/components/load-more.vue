<template>
  <div class="load-more">
    <img src="../common/image/loading.gif" width="24" height="24">
    <span>正在加载...</span>
  </div>
</template>

<script>
  export default {
    name: "load-more"
  }
</script>

<style lang="scss">
.load-more{
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  span{
    margin-left: 10px;
  }
}
</style>
