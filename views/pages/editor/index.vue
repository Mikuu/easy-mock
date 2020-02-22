<template>
  <div class="em-editor">
    <div class="em-editor__editor">
      <div ref="codeEditor"></div>
      <BodyHeaderEditor v-if="enableBodyHeaderEditor" v-bind:body="temp.body" v-bind:headers="temp.headers"/>
<!--      <div>-->
<!--        <ArimanCodeMirror></ArimanCodeMirror>-->
<!--      </div>-->
    </div>
    <div class="panel-info">
      <em-spots :size="10"></em-spots>
      <div class="wrapper">
        <h2>{{isEdit ? $t('p.detail.editor.title[0]') : $t('p.detail.editor.title[1]')}}</h2>
        <div class="em-editor__form">
          <Form label-position="top">
            <Form-item label="Method">
              <i-select v-model="temp.method">
                <Option v-for="item in methods" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </i-select>
            </Form-item>
            <Form-item label="URL">
              <i-input v-model="temp.url">
                <span slot="prepend">/</span>
              </i-input>
            </Form-item>
            <Form-item :label="$t('p.detail.columns[0]')">
              <i-input v-model="temp.description"></i-input>
            </Form-item>
            <Form-item :label="$t('p.detail.editor.autoClose')" v-if="isEdit">
              <i-switch v-model="autoClose"></i-switch>
            </Form-item>
            <Form-item>
              <Button type="primary" long @click="submit">{{isEdit ? $t('p.detail.editor.action[0]') : $t('p.detail.editor.action[1]')}}</Button>
            </Form-item>
          </Form>
        </div>
        <div class="em-editor__control">
          <div class="em-proj-detail__switcher">
            <ul>
              <li @click="format">{{$t('p.detail.editor.control[0]')}}</li>
              <li @click="preview" v-if="isEdit">{{$t('p.detail.editor.control[1]')}}</li>
              <li @click="close">{{$t('p.detail.editor.control[2]')}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import './index.css';
</style>

<script>
import * as api from '../../api'
import jsBeautify from 'js-beautify/js/lib/beautify'
import ArimanCodeMirror from '../../components/body-header-editor/ArimanCodeMirror'
import BodyHeaderEditor from '../../components/body-header-editor/BodyHeaderEditor'
let ace

/**
 * headerString, e.g.
 *  "customer-header-item=header-miku,customer-header-another=header-nanoha"
 *
 * return:
 *  [
 *    {
 *      key: 'customer-header-item',
 *      value: 'header-miku'
 *    },
 *    {
 *      key: 'customer-header-another',
 *      value: 'header-nanoha'
 *    }
 *
 *  ]
 * */
const headerStringToList = function (headerString) {
  let headers = []
  let key, value
  headerString.split(',').map(headerEntity => {
    let sections = headerEntity.split('=')
    key = sections.shift()
    value = sections.join('=') // in case there are multiple '=' in header value.
    headers.push({key: key, value: value})
  })

  return headers
}

const headerListToString = function (headerList) {
  return headerList.map(headerEntity => `${headerEntity.key}=${headerEntity.value}`).join(',')
}

/**
 * bodyString, e.g.
 *  "{ \n"name": "nanoha"\n}"
 *
 * return:
 *  {
 *    code: "{ \n"name": "nanoha"\n}"
 *  }
 *
 *  WHY DO THIS? don't ask, it's ashamed. T_T.
 * */
const bodyStringToObject = function (bodyString) {
  let bodyObject
  if (bodyString) {
    bodyObject = { code: bodyString }
  } else {
    bodyObject = { code: '' }
  }

  return bodyObject
}

if (typeof window !== 'undefined') {
  ace = require('brace')
  require('brace/mode/javascript')
  require('brace/theme/monokai')
  require('brace/ext/language_tools')
  require('brace/ext/searchbox')
  require('./snippets')
}

export default {
  name: 'editor',
  data () {
    return {
      codeEditor: null,
      autoClose: true,
      methods: [
        { label: 'get', value: 'get' },
        { label: 'post', value: 'post' },
        { label: 'put', value: 'put' },
        { label: 'delete', value: 'delete' },
        { label: 'patch', value: 'patch' }
      ],
      temp: {
        url: '',
        mode: '{"data": {}}',
        method: '', // the original code has a 'get' for default, but it causes a wired bug, don't believe? you can try.
        description: '',
        body: {
          code: ''
        },
        headers: []
      }
      // enableBodyHeaderEditor: false
    }
  },
  computed: {
    mockData () {
      // console.log('FBI --> Info: $store.state.mock.editorData.mock -> ', this.$store.state.mock.editorData.mock)
      // console.log('FBI --> Info: $store.state.mock.editorData -> ', this.$store.state.mock.editorData)
      // console.log('FBI --> Info: $store.state.mock -> ', this.$store.state.mock)
      // console.log('FBI --> Info: $store.state -> ', this.$store.state)
      // console.log('FBI --> Info: $store -> ', this.$store)

      return this.$store.state.mock.editorData.mock
    },
    baseUrl () {
      return this.$store.state.mock.editorData.baseUrl
    },
    projectId () {
      return this.$route.params.projectId
    },
    isEdit () {
      return !!this.$route.params.id && this.mockData
    },
    enableBodyHeaderEditor () {
      return this.isEdit && (this.mockData.body || this.mockData.headers)
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.matched.length === 0) { // 防止编辑页刷新导致的显示异常（直接进入项目主页）
      return next({
        path: `/project/${to.params.projectId}`,
        replace: true
      })
    }
    next()
  },
  mounted () {
    this.codeEditor = ace.edit(this.$refs.codeEditor)
    this.codeEditor.getSession().setMode('ace/mode/javascript')
    this.codeEditor.setTheme('ace/theme/monokai')
    this.codeEditor.setOption('tabSize', 2)
    this.codeEditor.setOption('fontSize', 15)
    this.codeEditor.setOption('enableLiveAutocompletion', true)
    this.codeEditor.setOption('enableSnippets', true)
    this.codeEditor.clearSelection()
    this.codeEditor.getSession().setUseWorker(false)
    this.codeEditor.on('change', this.onChange)
    this.codeEditor.commands.addCommand({
      name: 'save',
      bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
      exec: () => {
        this.submit()
      }
    })

    if (this.isEdit) {
      this.autoClose = true
      this.temp.url = this.mockData.url.slice(1) // remove /
      this.temp.mode = this.mockData.mode
      this.temp.method = this.mockData.method
      this.temp.description = this.mockData.description

      console.log('FBI --> Info: this.mockData --> ', this.mockData)
      console.log('FBI --> Info: temp.method --> ', this.temp.method)
      // if (this.mockData.body) {
      //   this.temp.body = { code: this.mockData.body }
      // } else {
      //   this.temp.body = { code: '' }
      // }
      this.temp.body = bodyStringToObject(this.mockData.body)
      this.temp.headers = this.mockData.headers ? headerStringToList(this.mockData.headers) : []
    }

    this.$nextTick(() => {
      this.codeEditor.setValue(this.temp.mode)
      this.format()
    })
  },
  methods: {
    convertUrl (url) {
      const newUrl = '/' + url
      return newUrl === '/'
        ? '/'
        : newUrl.replace(/\/\//g, '/').replace(/\/$/, '')
    },
    withSerializedBodyAndHeaders () {
      let _temp = {...this.temp}
      _temp.headers = headerListToString(_temp.headers)
      _temp.body = _temp.body.code
      return _temp
    },
    format () {
      const context = this.codeEditor.getValue()
      let code = /^http(s)?/.test(context)
        ? context
        : jsBeautify.js_beautify(context, { indent_size: 2 })
      this.codeEditor.setValue(code)
    },
    onChange () {
      this.temp.mode = this.codeEditor.getValue()
    },
    close () {
      this.$store.commit('mock/SET_EDITOR_DATA', {mock: null, baseUrl: ''})
      this.$router.replace(`/project/${this.projectId}`)
    },
    submit () {
      const mockUrl = this.convertUrl(this.temp.url)

      try {
        const value = (new Function(`return ${this.temp.mode}`))() // eslint-disable-line
        if (!value) {
          this.$Message.error(this.$t('p.detail.editor.submit.error[0]'))
          return
        } else if (typeof value !== 'object') {
          throw new Error()
        }
      } catch (error) {
        if (!/^http(s)?:\/\//.test(this.temp.mode)) {
          this.$Message.error(error.message || this.$t('p.detail.editor.submit.error[1]'))
          return
        }
      }

      if (this.isEdit) {
        api.mock.update({
          data: {
            // ...this.temp, // the original code
            ...this.withSerializedBodyAndHeaders(), // added by Ariman
            id: this.mockData._id,
            url: mockUrl
          }
        }).then((res) => {
          if (res.data.success) {
            this.$Message.success(this.$t('p.detail.editor.submit.updateSuccess'))
            if (this.autoClose) this.close()
          }
        })
      } else {
        api.mock.create({
          data: {
            ...this.temp,
            url: mockUrl,
            project_id: this.projectId
          }
        }).then((res) => {
          if (res.data.success) {
            this.$Message.success(this.$t('p.detail.create.success'))
            this.close()
          }
        })
      }
    },
    preview () {
      window.open(this.baseUrl + this.mockData.url + '#!method=' + this.mockData.method)
    }
  },
  components: {
    BodyHeaderEditor,
    ArimanCodeMirror
  }
}
</script>
