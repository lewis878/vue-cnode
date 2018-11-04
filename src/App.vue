<template>
  <div id="app" v-cloak>
    <router-view/>
    <back-to-top></back-to-top>
  </div>
</template>

<script>
  import backToTop from './components/back-to-top'

  export default {
    name: 'App',
    components: {
      backToTop
    }
  }
</script>

<style lang="scss">

</style>
