'use strict'

const ErrorEnum = require('../../util/ErrorEnum')

function handleError(error) {
	if (!error) {
		return { success: false, code: ErrorEnum.FUNCTION_MISUSE_PARAM_MISSING }
	}
	if (ErrorEnum.has(error.message)) {
		return { success: false, code: error.message }
	} else {
		return { success: false, message: error.message }
	}
}

module.exports = handleError
