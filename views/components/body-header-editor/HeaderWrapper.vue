<template>
  <div>
    <ul id="header-list">
      <li v-for="(header, index) in headers">
        <HeaderEntity v-bind:header="header" v-bind:index="index" v-on:removeHeaderThrough="removeHeaderThrough"/>
      </li>
    </ul>
  </div>
</template>

<script>
  import HeaderEntity from './HeaderEntity'

  export default {
    name: 'HeaderWrapper',
    data () {
      return {}
    },
    props: ['headers'],
    components: {
      HeaderEntity
    },
    methods: {
      removeHeaderThrough: function (index) {
        this.$emit('removeHeader', index)
      }
    }
  }
</script>

<style scoped>

</style>
