<template>
  <span class="tag" :class="type">{{text}}</span>
</template>

<script>
  export default {
    name: "tag",
    props:['type','text']
  }
</script>

<style lang="scss">
  @import "../common/scss/var";
  .tag {
    line-height: 1;
    padding: 5px;
    font-size: 12px;
    color: #fff;
    background: hotpink;
    border-radius: 4px;
    &.top {
      background: #ed3931;
    }
    &.good {
      background: #ed713a;
    }
    &.share {
      background: $color-theme;
    }
    &.ask {
      background: #459eff;
    }
    &.job {
      background: #7b77ed;
    }
    &.dev {
      background: #eda08a;
    }
  }
</style>
