<template>
  <Modal
    v-model="recorder.openRecordModal"
    @on-ok="ok"
    @on-cancel="cancel">

    <div class="root-container">
      <div class="target-root-container">
        <Row type="flex" justify="center">
          <Col class="targetLabelContainer" span="4">
            <h4>Target Host</h4>
          </Col>
          <Col span="20">
            <Input v-model="recorder.targetHost" placeholder="http://localhost:8080"></Input>
          </Col>
        </Row>
      </div>

      <div class="header-root-container">
        <Row type="flex" justify="start">
          <Col class="targetLabelContainer" span="8">
            <h4>Capture Headers</h4>
            <Button type="text" v-on:click="newHeader">+</Button>
          </Col>
        </Row>

        <div>
          <ul id="header-list" style="list-style: none;">
            <li class="header-container" v-for="(header, index) in recorder.headers">
              <HeaderEntity v-bind:header="header" v-bind:index="index" v-on:removeHeaderThrough="removeHeaderThrough"></HeaderEntity>
            </li>
          </ul>
        </div>
      </div>
    </div>



  </Modal>
</template>

<script>
  import HeaderEntity from './header-entity'

  export default {
    name: 'StartRecord',
    data () {
      return {}
    },
    props: ['recorder'],
    methods: {
      ok () {
        this.$emit('modalOk')
      },
      cancel () {
        this.$emit('modalCancel')
      },
      newHeader () {
        this.$emit('modalAddHeader')
      },
      removeHeaderThrough (index) {
        this.$emit('modalRemoveHeader', index)
      }
    },
    components: {
      HeaderEntity
    }
  }
</script>

<style scoped>
  .targetLabelContainer {
    display: flex;
    align-items: center;
  }
  .root-container {
  }
  .target-root-container {
    padding-bottom: 1.5rem;
  }
  .header-root-container {
    min-height: 160px;
    margin-bottom: 1rem;
  }
  .header-container {
    padding-bottom: 0.1rem;
    padding-top: 0.1rem;
  }

</style>
