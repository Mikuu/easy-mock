<template>
  <div>
    <Row>
      <Col class="key-container" span="10">
        <Input class="editor-general" v-model="header.key" placeholder="key"></Input>
      </Col>
      <Col class="value-container" span="11">
        <Input class="editor-general" v-model="header.value" placeholder="value"></Input>
      </Col>
      <Col class="delete-container" span="3">
        <Button class="delete-button" type="primary" shape="circle" icon="trash-a" v-on:click="removeHeaderEntity"></Button>
      </Col>

    </Row>
  </div>
</template>

<script>
  export default {
    name: 'HeaderEntity',
    data () {
      return {
        key: '',
        value: ''
      }
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
  }
  .delete-button {
    background-color: #272820;
    border-color: #555650;
  }
  .editor-general :nth-last-child(1) {
    background-color: #2f3128 !important;
    color: #dfe2e5 !important;
    border: unset;
  }

</style>
