'use strict'

const { RecordProxy } = require('../proxy')
const { record } = require('../services/wiremock')

module.exports = class RecordController {
  /**
   * for testing, only
   */

  static async echo (ctx) {
    console.log('FBI --> Info: echo in RecordController')
    ctx.body = ctx.util.resuccess({ content: 'echo ni mei ya' })
  }

  /**
   * get a project's existing record
   */

  static async get (ctx) {
    const projectId = ctx.checkQuery('projectId').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 400, ctx.errors)
      return
    }

    console.log(`FBI --> Info: getting record, projectId=${projectId}`)

    const record = await RecordProxy.getByProjectId(projectId)

    if (record) {
      console.log(record)
      ctx.body = await ctx.util.resuccess(
        {serverId: record.serverId, recorderBaseUrl: record.recorderBaseUrl}
      )
    } else {
      ctx.body = ctx.util.refail(`record not found by projectId=${projectId}`)
    }
  }

  /**
   * create and start a new record
   */

  static async start (ctx) {
    const target = ctx.checkBody('target').notEmpty().value
    const projectId = ctx.checkBody('projectId').notEmpty().value
    const captureHeaders = ctx.checkBody('captureHeaders').value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 400, ctx.errors)
      return
    }

    console.log(`FBI --> Info: sending request to Wadapter to start record, targetHost=${target}`, captureHeaders)

    const res = await record.start({data: {target: target, captureHeaders: captureHeaders}})

    if (!res || res.status !== 200) {
      console.error('FBI --> Error: start wiremock recording failed:')
      console.error(res)
      ctx.body = ctx.util.refail('start wiremock recording failed.')
    } else {
      console.log(res.data)
      await RecordProxy.newAndSave({
        project: projectId,
        serverId: res.data.serverId,
        recorderBaseUrl: res.data.recorderBaseUrl
      })

      ctx.body = await ctx.util.resuccess(
        {serverId: res.data.serverId, recorderBaseUrl: res.data.recorderBaseUrl}
      )
    }
  }

  /**
   * stop and delete an existing record
   */

  static async stop (ctx) {
    const serverId = ctx.checkQuery('serverId').notEmpty().value
    const projectId = ctx.checkQuery('projectId').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 400, ctx.errors)
      return
    }

    console.log(
      `FBI --> Info: sending request to Wadapter to stop record, serverId=${serverId}, projectId=${projectId}`
    )

    const res = await record.stop({params: {serverId: serverId, projectId: projectId}})

    if (res && res.status === 200) {
      console.log(res.data)
      await RecordProxy.deleteByProjectId(res.data.projectId)

      ctx.body = await ctx.util.resuccess(
        {projectId: res.data.projectId, mockIdList: res.data.mockIdList}
      )
    } else {
      console.error('FBI --> Error: stop wiremock recording failed:')
      console.error(res)
      ctx.body = ctx.util.refail('stop wiremock recording failed.')
    }
  }
}
