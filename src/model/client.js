var bookshelf = require('../common/db.js').bookshelf;

var client = bookshelf.Model.extend({
    tableName: 'client'
});

module.exports = client;
