'use strict'

const connection = require('../database/connection')
const ErrorEnum = require('../util/ErrorEnum')

class Member {
	async create(email, username, password) {
		await connection.run('insert.member', email, username, password)
		await this.get(username)
	}

	async get(username) {
		const results = await connection.all('select.memberByUsername', username)
		if (results === undefined || results.length !== 1) {
			throw Error(ErrorEnum.USERNAME_UNKNOWN)
		}
		Object.assign(this, results[0])
	}

	async promote(type, visibility, username) {
		if (type !== 'long') {
			return
		}
		if (visibility !== 'public') {
			return
		}
		await connection.run('update.promote', username)
	}
}

module.exports = Member
