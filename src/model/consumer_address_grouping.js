var bookshelf = require('../common/db.js').bookshelf;

var consumerAddressGrouping = bookshelf.Model.extend({
    tableName: 'consumer_address_grouping'
});

module.exports = consumerAddressGrouping;
