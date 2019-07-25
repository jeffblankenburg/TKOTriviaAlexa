const assert = require('assert')
const Logger = require('../log-stream')
const _ = require('lodash')

describe('log-stream', function() {
  it('logs correctly', () => {
    var logger = new Logger({
      logGroupName: 'test',
      maxStreams: 10,
      debug: true,
      printErrors: true,
      region: 'us-east-1'
    })

    assert(_.hasIn(logger, 'log'))

    var i = 10
    var stream = false
    while (--i) {
      stream = logger.log("test", (err) => {
        if (err) console.log(err)
        assert(!err)
      })
    }
  })

  it('logs correctly without a callback', () => {
    var logger = new Logger({
      logGroupName: 'test',
      maxStreams: 10,
      debug: true,
      printErrors: true,
      region: 'us-east-1'
    })

    assert(_.hasIn(logger, 'log'))

    var i = 10
    var stream = false
    while (--i) {
      stream = logger.log("test")
    }
    setTimeout(() => assert(stream), 3000)
  })
})