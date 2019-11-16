'use strict'

const ErrorEnum = require('../../../util/ErrorEnum')

function handleError(context, error) {
  if (context === undefined) {
    throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
  }
  if (error === undefined) {
    throw Error(ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING)
  }
  if (ErrorEnum.has(error.message)) {
    context.body = { success: false, code: error.message }
  } else {
    context.body = { success: false, message: error.message }
  }
}

module.exports = handleError
