const config = require('../knexfile.js')
const knex = require('knex')(config)

if (process.env.NODE_ENV === 'development') {
    knex.migrate.latest([config])
}

module.exports = knex
