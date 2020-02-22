<template>
  <codemirror v-model="body.code" :options="cmOptions"></codemirror>
</template>

<script>
  let codemirror
  if (typeof window !== 'undefined') {
    codemirror = require('vue-codemirror').codemirror
    require('codemirror/mode/javascript/javascript.js')
    // theme css
    require('codemirror/lib/codemirror.css')
    require('codemirror/theme/base16-dark.css')
  }

  export default {
    name: 'ArimanCodeMirror',
    data () {
      return {
        code: '',
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-dark',
          lineNumbers: true,
          line: true
        }
      }
    },
    props: ['body'],
    methods: {
      onCmReady (cm) {
        console.log('the editor is readied!', cm)
      },
      onCmFocus (cm) {
        console.log('the editor is focus!', cm)
      },
      onCmCodeChange (newCode) {
        console.log('this is new code', newCode)
        this.code = newCode
      }
    },
    computed: {
      codemirror () {
        return this.$refs.myCm.codemirror
      }
    },
    mounted () {
      // console.log('FBI --> Info: body ->', this.body)
      // console.log('this is current codemirror object', this.codemirror)
    },
    components: {
      codemirror
    }
  }
</script>

<style scoped>

</style>
