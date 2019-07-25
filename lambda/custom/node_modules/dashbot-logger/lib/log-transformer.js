const { Transform } = require('stream')
const _ = require('lodash')
const { isLogMessage } = require('./util')

class LogTransformer extends Transform {
  constructor (options) {
    super({
      objectMode: true,
      writeableObjectMode: true,
      readableObjectMode: true
    })

    this.debug = options.debug || false
  }

  toCloudWatchLog (chunk) {
    if (_.isObject(chunk)) {
      if (!isLogMessage(chunk)) {
        return {
          timestamp: new Date().getTime(),
          message: JSON.stringify(chunk)
        }
      } else {
        return new Error(`Value should not contain log fields`)
      }
    } else {
      return {
        timestamp: new Date().getTime(),
        message: chunk
      }
    }
  }

  _transform (chunk, encoding, callback) {
    var newValue = this.toCloudWatchLog(chunk)

    if (newValue instanceof Error) {
      if (this.debug) {
        console.log(JSON.parse(JSON.stringify(chunk)))
      }
      callback(newValue)
      return
    }

    callback(null, newValue)
  }
}

module.exports = LogTransformer
