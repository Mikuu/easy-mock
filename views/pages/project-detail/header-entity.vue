<template>
  <div>
    <Row>
      <Col class="key-container" span="23">
        <Input v-model="header.key" placeholder="key"></Input>
      </Col>
      <Col class="delete-container" span="1">
        <Button class="delete-button" type="text" v-on:click="removeHeaderEntity">-</Button>
      </Col>

    </Row>
  </div>
</template>

<script>
  export default {
    name: 'HeaderEntity',
    data () {
      return {}
    },
    props: ['header', 'index'],
    methods: {
      removeHeaderEntity: function () {
        this.$emit('removeHeaderThrough', this.index)
      }
    }
  }
</script>

<style scoped>
  .key-container {
    padding-right: 0.1rem;
  }
  .value-container {
    padding-left: 0.1rem;
  }
  .delete-container {
    text-align: center;
    padding-left: 0.1rem;
  }
  .delete-button {
    color: #444d56;
  }

</style>
