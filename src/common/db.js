'use strict';

var params = require('../../app/config/parameters.json').database;

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : params.host,
        user : params.user,
        password : params.password,
        database : params.schema
    }
});

var bookshelf = require('bookshelf')(knex);

module.exports = {
    knex: knex,
    bookshelf: bookshelf
};
