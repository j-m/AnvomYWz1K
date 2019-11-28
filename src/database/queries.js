'use strict'

const { promisify } = require('util')
const fs = require('fs')
const glob = require('glob')
const readFilePromise = promisify(fs.readFile)
const globPromise = promisify(glob)

let sql = { }

async function addSQLStatement(path, data) {
	const trimmedPath = path.replace('./src/database/sql/', '').replace('.sql', '').replace('/', '.')
	sql[trimmedPath] = data
}

async function load() {
	sql = { }
	const files = await globPromise('./src/database/sql/**/*.sql')
	const promises = []
	for (const file of files) {
		promises.push(readFilePromise(file, 'utf-8').then(data => addSQLStatement(file, data)))
	}
	await Promise.all(promises)
}

function close() {
	sql = { }
}

function get(file) {
	if (file === undefined) {
		return sql
	}
	if (sql[file] === undefined) {
		throw Error(`Unknown query '${file}'`)
	}
	return sql[file]
}

module.exports = { get, load, close }
