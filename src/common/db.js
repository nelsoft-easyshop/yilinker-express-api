var parameters = require('../../app/config/parameters');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : parameters.database_host,
        user : parameters.database_user,
        password : parameters.database_password,
        database : parameters.database_name
    }
});

var bookshelf = require('bookshelf')(knex);

module.exports = {
    knex: knex,
    bookshelf: bookshelf
};
