const axios = require('axios')
const arimanConfig = require('../config/ariman.config')

const instance = axios.create({
  baseURL: arimanConfig.recorder.wiremock.host,
  timeout: arimanConfig.recorder.timeout
})

const createAPI = (url, method, config) => {
  config = config || {}
  return instance({
    url,
    method,
    ...config
  })
}

const record = {
  start: config => createAPI(arimanConfig.recorder.wiremock.endpoints.startRecord, 'post', config),
  stop: config => createAPI(arimanConfig.recorder.wiremock.endpoints.stopRecord, 'post', config)
}

module.exports = {
  record
}
