<template>
  <transition>
    <div class="back-to-top" v-show="show" @click="back">
      <i class="icon-back-to-top"></i>
    </div>
  </transition>
</template>

<script>
  import $ from 'jquery'
  import {scroll} from '../common/js/utils'

  export default {
    name: "back-to-top",
    data() {
      return {
        show: false
      }
    },
    mounted() {
      $(window).scroll(() => {
        scroll((dir) => {
          this.show = window.pageYOffset >= 800 && dir === 'up'
        })
      })
    },
    methods: {
      back() {
        $('html,body').animate({
          scrollTop: 0
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";

  .back-to-top {
    position: fixed;
    right: 10px;
    bottom: 80px;
    width: 50px;
    height: 50px;
    background: $color-theme-d;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    color: #fff;
    .icon-back-to-top {
      font-size: 30px;
    }
  }

  .v-enter-active,.v-leave-active{
    transition: opacity 0.3s ease;
  }
  .v-enter,.v-leave-to{
    opacity: 0;
  }
</style>
