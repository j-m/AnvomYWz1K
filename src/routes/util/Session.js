'use strict'

class Session {
  constructor(session) {
    this.authorised = session.authorised || false
    this.username = session.username
    this.privileges = session.privileges || 'none'
    this.administrator = this.privileges === 'administrator'
    this.moderator = this.privileges !== 'none'
  }

  get data() {
    return {
      authorised: this.authorised,
      username: this.username,
      privileges: this.privileges,
      administrator: this.administrator,
      moderator: this.moderator
    }
  }
}

module.exports = Session
