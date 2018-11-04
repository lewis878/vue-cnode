<template>
  <transition name="alert">
    <div class="alert" v-if="show">{{text}}</div>
  </transition>
</template>

<script>
  export default {
    name: "v-alert",
    props: ['text', 'show']
  }
</script>

<style lang="scss">
  .alert {
    position: fixed;
    z-index: 98;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    background: rgba(0, 0, 0, 0.7);
    text-align: center;
    line-height: 44px;
    color: #fff;
  }

  .alert-enter-active, .alert-leave-active {
    transition: top 0.3s ease;
  }

  .alert-enter, .alert-leave-to {
    top: -44px;
  }
</style>
