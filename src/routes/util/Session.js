'use strict'

class Session {
	constructor(session) {
		this.authorised = session.authorised || false
		this.username = session.username
		this.privileges = session.privileges || 'none'
		this.administrator = this.privileges === 'administrator'
		this.moderator = this.privileges !== 'none'
	}
}

module.exports = Session
