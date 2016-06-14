var bookshelf = require('../common/db.js').bookshelf;

var consumerAddressGroup = bookshelf.Model.extend({
    tableName: 'consumer_address_group'
});

module.exports = consumerAddressGroup;
