<template>
  <div class="v-header">
    <div class="header" :class="{slide:show}">
      <div class="toolbar" @click="show=true">
        <i class="icon-menu"></i>
      </div>
      <h1>{{head}}</h1>
      <router-link class="plane" to="/topic/create">
        <i class="icon-plane"></i>
      </router-link>
    </div>
    <div class="mask" :class="{show}" @click="show=false"></div>
    <v-menu :class="{show}"></v-menu>
  </div>
</template>

<script>
  import $ from 'jquery';
  import vMenu from './v-menu'

  export default {
    name: "v-header",
    props: ['head'],
    components: {
      vMenu
    },
    data() {
      return {
        show: false
      }
    },
    mounted(){
      $('.mask').on('touchmove',function (e) {
        e.preventDefault()
      })
    },
    watch:{
      '$route'(){
        this.show = false
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";

  .header {
    &.slide {
      left: 200px;
    }
    position: fixed;
    z-index: 98;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    background: #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    text-align: center;
    line-height: 44px;
    transition: left 0.3s ease;
    .toolbar, .plane {
      position: absolute;
      top: 0;
      width: 44px;
      height: 44px;
      cursor: pointer;
      i {
        font-size: 20px;
      }
    }
    .toolbar {
      left: 5px;
    }
    .plane {
      right: 5px;
      color: $color-theme;
    }
    > h1 {
      height: 44px;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .mask {
    &.show {
      opacity: 1;
      pointer-events: all;
    }
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
</style>
