var bookshelf = require('../common/db.js').bookshelf;

var consumerAddress = bookshelf.Model.extend({
    tableName: 'consumer_address'
});

module.exports = consumerAddress;
