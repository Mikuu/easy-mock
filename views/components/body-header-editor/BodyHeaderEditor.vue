<template>
  <div class="root-container">
    <Row class="full-height">

      <Col class="full-height" span="14">
        <div class="body-container" >
          <div class="title">Request Body</div>
          <div class="body-header-inner-editor">
            <ArimanCodeMirror v-bind:body="body"/>
          </div>
        </div>
      </Col>

      <Col class="full-height" span="10">
        <div class="header-container" >

          <div class="title">
            <Row>
              <Col span="21">
                <div class="">Request Header</div>
              </Col>
              <Col class="header-add-button-container" span="3">
                <Button class="header-add-button" type="primary" icon="plus" v-on:click="newHeader"></Button>
              </Col>
            </Row>
          </div>

          <div class="body-header-inner-editor">
            <HeaderWrapper v-bind:headers="headers" v-on:removeHeader="removeHeader"/>
          </div>

        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import ArimanCodeMirror from './ArimanCodeMirror'
  import HeaderWrapper from './HeaderWrapper'

  export default {
    name: 'BodyHeaderEditor',
    data () {
      return {}
    },
    props: ['body', 'headers'],
    components: {
      ArimanCodeMirror,
      HeaderWrapper
    },
    mounted () {
      // console.log('FBI --> Info: body in BodyHeaderEditor ->', this.body)
      // console.log('this is current codemirror object', this.codemirror)
    },
    methods: {
      newHeader: function () {
        this.headers.push({key: '', value: ''})
      },
      removeHeader: function (index) {
        this.headers.splice(index, 1)
      }
    }
  }
</script>

<style scoped>
  .root-container {
    height: 100%;
    padding-top: 1rem;
    background-color: #444d56;
  }
  .body-container {
    height: 100%;
    background-color: #272821;
    margin-right: 0.5rem;
    padding-left: 3rem;
    padding-right: 3rem;
    padding-top: 1.5rem;
  }
  .header-container {
    height: 100%;
    background-color: #272821;
    margin-left: 0.5rem;
    padding-left: 3rem;
    padding-right: 3rem;
    padding-top: 1.5rem;
  }
  .title {
    color: #6a737d;
    font-size: large;
    padding-bottom: 0.5rem;
    border-bottom-style: solid;
    border-bottom-width: thin;
    border-bottom-color: #555650;
  }
  .full-height {
    height: inherit;
  }
  .body-header-inner-editor {
    padding-top: 1rem;
  }
  .header-add-button-container {
    text-align: center;
  }
  .header-add-button {
    border: unset;
    background-color: #272820;
  }

</style>
