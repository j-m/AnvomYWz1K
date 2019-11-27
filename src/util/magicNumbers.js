'use strict'

const MAGIC_NUMBERS = {
	PERCENTAGE_MULTIPLIER: 100,

	MILLISECONDS_IN_A_SECOND: 1000,
	SECONDS_IN_A_MINUTE: 60,
	MINUTES_IN_AN_HOUR: 60,
	HOURS_IN_A_DAY: 24,
	DAYS_IN_A_WEEK: 7,

	MILLISECONDS_IN_A_MINUTE: this.MILLISECONDS_IN_A_SECOND * this.SECONDS_IN_A_MINUTE,
	MILLISECONDS_IN_A_HOUR: this.MILLISECONDS_IN_A_MINUTE * this.MINUTES_IN_AN_HOUR,
	MILLISECONDS_IN_A_DAY: this.MILLISECONDS_IN_A_HOUR * this.HOURS_IN_A_DAY,
	MILLISECONDS_IN_A_WEEK: this.MILLISECONDS_IN_A_DAY * this.DAYS_IN_A_WEEK
}

module.exports = MAGIC_NUMBERS
