<template>
  <div class="about">
    <v-header head="关于"></v-header>
    <ul class="desc">
      <li>
        <h3>关于项目</h3>
        <p>该项目是基于Cnodejs的api，采用vue.js重写的webapp。</p>
      </li>
      <li>
        <h3>当前版本</h3>
        <p>V1.0</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import vHeader from '../components/v-header'

  export default {
    name: "about",
    components: {
      vHeader
    }
  }
</script>

<style lang="scss">
  @import "../common/scss/var";

  .about {
    padding-top: 44px;
    background: #fff;
    .desc{
      margin: 0 15px;
      li{
        padding: 10px 0;
        border-bottom: $border;
        h3{
          font-size: 16px;
          font-weight: bold;
        }
        p{
          margin-top: 5px;
          a{
            color: $color-theme;
          }
        }
      }
    }
  }
</style>
