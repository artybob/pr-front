<template>
  <div id="app">
    <v-app>
    <Purchases></Purchases>
    </v-app>
  </div>
</template>

<script>

import Purchases from './components/purchases/Purchases.vue'

export default {
  name: 'App',
  components: {
    Purchases
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
