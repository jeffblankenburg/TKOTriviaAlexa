'use strict'

const Aws = require('aws-sdk')
const { Writable } = require('stream')
const genericPool = require('generic-pool')
const { getMissingFields, getLogStreamName } = require('./util')
const _ = require('lodash')

class LogWriter extends Writable {
  constructor (options) {
    super({ objectMode: true })
    const missing = getMissingFields(options, ['logGroupName'])
    if (missing.length) {
      throw new Error(`${missing} required.`)
    }

    this.logGroupName = options.logGroupName || process.env.DASHBOT_LOG_GROUP_NAME
    this.logStreamPrefix = options.logStreamPrefix || process.env.DASBOT_LOG_STREAM_PREFIX || 'dashbot'
    this.debug = options.debug || false
    this.printErrors = options.printErrors || false

    this.cloudWatchLogs = new Aws.CloudWatchLogs({
      region: options.region,
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey
    })

    this.poolOptions = {
      max: options.maxStreams || process.env.DASHBOT_LOG_MAX_STREAMS,
      min: options.minStreams || process.env.DASHBOT_LOG_MIN_STREAMS
    }

    this.streamPoolPromise = this.createStreamPool(this.poolOptions)
  }

  createStreamPool (options) {
    var that = this

    return this.createLogGroup(this.logGroupName)
      .then(() => {
        const poolFactory = {
          create: () => that.createLogStream(getLogStreamName(that.logStreamPrefix)),
          destroy: () => {}
        }

        that.logStreamsPool = genericPool.createPool(poolFactory, options || that.poolOptions)

        if (that.debug) {
          console.log('Created stream pool')
        }
      })
  }

  createLogStream (logStreamName) {
    var that = this

    return this.cloudWatchLogs.createLogStream({
      logGroupName: this.logGroupName,
      logStreamName
    })
      .promise()
      .then(() => {
        return that.createStreamResource(
          logStreamName,
          null
        )
      }, (err) => {
        if (that.printErrors || that.debug) {
          console.log(`Error creating stream: ${err}`)
        }
        throw new Error(err)
      })
  }

  createLogGroup (logGroupName) {
    var that = this

    return this.cloudWatchLogs.createLogGroup({
      logGroupName: logGroupName
    })
      .promise()
      .then((data) => {
        if (that.debug) {
          console.log(`Log group created: ${JSON.stringify(data)}`)
        }
        return data
      }, (err) => {
        if (err && err.code === 'ResourceAlreadyExistsException') {
          if (that.debug) {
            console.log(`Log group already exists: ${err}`)
          }
          err = null
        } else if (err) {
          if (that.printErrors || that.debug) {
            console.log(`Error creating group ${err}`)
          }
        }
      })
  }

  putLogEvents (stream, logs) {
    var that = this

    return this.cloudWatchLogs.putLogEvents({
      logEvents: logs,
      logGroupName: this.logGroupName,
      logStreamName: stream.streamName,
      sequenceToken: stream.sequenceToken
    })
      .promise()
      .then((data) => {
        if (that.debug) {
          console.log(`Successfully wrote to stream ${stream.streamName}`)
        }
        stream.sequenceToken = data.nextSequenceToken
        return stream
      }, (err) => {
        if (that.printErrors || that.debug) {
          console.log(`Error putting log event: ${err}`)
        }
      })
  }

  createStreamResource (streamName, sequenceToken) {
    return {
      streamName: streamName,
      sequenceToken: sequenceToken
    }
  }

  acquireStream () {
    return this.logStreamsPool.acquire()
  }

  releaseStream (stream) {
    var that = this

    return this.logStreamsPool.release(stream)
      .catch((err) => {
        if (that.printErrors || that.debug) {
          console.log(`Error releasing stream ${stream} with message ${err}`)
        }
      })
  }

  _write (chunk, encoding, done) {
    var that = this
    var log = chunk

    if (!Array.isArray(chunk)) {
      log = [chunk]
    }

    this.streamPoolPromise
      .then(() =>
        that.acquireStream()
      )
      .then((stream) => {
        done() // eager consumption

        if (that.debug) {
          console.log(`Log to write ${JSON.stringify(log)}`)
        }

        return that.putLogEvents(stream, log)
      })
      .then((stream) =>
        that.releaseStream(stream)
      )
      .catch((err) => {
        if (that.printErrors || that.debug) {
          console.log(`Error in write: ${err}`)
        }

        done(err)
      })
  }

  _writev (chunks, done) {
    var that = this
    var logs = chunks

    if (!Array.isArray(chunks)) {
      logs = [chunks]
    }

    logs = _.map(chunks, 'chunk')

    this.streamPoolPromise
      .then(() =>
        that.acquireStream()
      )
      .then((stream) => {
        done()

        if (that.debug) {
          console.log(`Log to write ${JSON.stringify(logs)}`)
        }

        return that.putLogEvents(stream, logs)
      })
      .then((stream) =>
        that.releaseStream(stream)
      )
      .catch((err) => {
        if (that.printErrors || that.debug) {
          console.log(`Error in writev: ${err}`)
        }

        done(err)
      })
  }
}

module.exports = LogWriter
