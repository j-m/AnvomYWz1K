'use strict'

const ErrorEnum = {
	FUNCTION_MISUSE_PARAM_MISSING: 'FUNCTION_MISUSE_PARAM_MISSING',

	SESSION_LOGGED_IN: 'LOGGED_IN',
	SESSION_NOT_LOGGED_IN: 'NOT_LOGGED_IN',
	SESSION_INSUFFICIENT_PRIVILEGES: 'SESSION_INSUFFICIENT_PRIVILEGES',
	SESSION_USERNAME_NOT_SET: 'SESSION_USERNAME_NOT_SET',
	SESSION_PRIVILEGES_NOT_SET: 'SESSION_PRIVILEGES_NOT_SET',

	USERNAME_MISSING: 'USERNAME_MISSING',
	USERNAME_UNKNOWN: 'USERNAME_UNKNOWN',
	USERNAME_BAD_REGEX: 'USERNAME_BAD_REGEX',
	USERNAME_IN_USE: 'USERNAME_IN_USE',
	USER_NOT_LOADED: 'USER_NOT_LOADED',

	PASSWORD_MISSING: 'PASSWORD_MISSING',
	PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
	PASSWORD_INCORRECT: 'PASSWORD_INCORRECT',

	EMAIL_MISSING: 'EMAIL_MISSING',

	GAME_UNKNOWN: 'GAME_UNKNOWN',
	GAME_NOT_LOADED: 'GAME_NOT_LOADED',
	GAME_STEAM_APP_ID_MISSING: 'GAME_STEAM_APP_ID_MISSING',
	GAME_TITLE_IN_USE: 'GAME_TITLE_IN_USE',
	GAME_TITLE_MISSING: 'GAME_TITLE_MISSING',
	GAME_SUMMARY_MISSING: 'GAME_SUMMARY_MISSING',
	GAME_UNEXPECTED_KEY: 'GAME_UNEXPECTED_KEY',

	REVIEW_GAME_MISSING: 'REVIEW_GAME_MISSING',
	REVIEW_AUTHOR_MISSING: 'REVIEW_AUTHOR_MISSING',
	REVIEW_RATING_MISSING: 'REVIEW_RATING_MISSING',
	REVIEW_BODY_MISSING: 'REVIEW_BODY_MISSING',
	REVIEW_TYPE_MISSING: 'REVIEW_TYPE_MISSING',
	REVIEW_UNEXPECTED_KEY: 'REVIEW_UNEXPECTED_KEY',
	REVIEW_ALREADY_WRITTEN: 'REVIEW_ALREADY_WRITTEN',
	REVIEW_NOT_FOUND: 'REVIEW_NOT_FOUND',
	REVIEW_VISIBILITY_MISSING: 'REVIEW_VISIBILITY_MISSING',
	REVIEW_INSUFFICIENT_PRIVILEGES: 'REVIEW_INSUFFICIENT_PRIVILEGES',

	COMMENT_AUTHOR_MISSING: 'COMMENT_AUTHOR_MISSING',
	COMMENT_REVIEW_GAME_MISSING: 'COMMENT_REVIEW_GAME_MISSING',
	COMMENT_REVIEW_AUTHOR_MISSING: 'COMMENT_REVIEW_AUTHOR_MISSING',
	COMMENT_REVIEW_TYPE_MISSING: 'COMMENT_REVIEW_TYPE_MISSING',

	undefined: 'UNKNOWN_ERROR',
	has: property => Object.prototype.hasOwnProperty.call(ErrorEnum, property)
}

Object.freeze(ErrorEnum)
module.exports = ErrorEnum
