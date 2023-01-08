<template>
  <router-view />
</template>

<script>

export default {
  name: 'App',
}
</script>

<style lang="stylus">

  @font-face {
    font-family: Comic-Sans;
    src: url('./assets/fonts/Comic Sans MS 400.ttf');
  }
 
  :root
    font-family Comic-Sans
    background-color #000
  
  body
    margin 0
    color color-light
</style>