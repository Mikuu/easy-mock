'use strict'

const { Record } = require('../models')

module.exports = class MockProxy {
  static newAndSave (docs) {
    return Record.insertMany(docs)
  }

  // each project only allows to have once record, so it can delete record by projectId here.
  static deleteByProjectId (projectId) {
    return Record.remove({project: projectId})
  }

  static getByProjectId (projectId) {
    return Record.findOne({project: projectId})
  }
}
