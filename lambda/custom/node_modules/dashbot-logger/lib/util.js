const uuid = require('uuid')
const _ = require('lodash')

const isLambda = () =>
  !!((process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV) || false)

const getMissingFields = (obj, fields) =>
  _.filter(fields, (field) => !_.has(obj, field))

const getLogStreamName = (prefix) =>
  `${prefix}-${Date.now()}-${uuid.v4()}`

const isLogMessage = (value) =>
  getMissingFields(value, ['timestamp', 'message']).length === 0

module.exports.isLambda = isLambda
module.exports.getMissingFields = getMissingFields
module.exports.getLogStreamName = getLogStreamName
module.exports.isLogMessage = isLogMessage
