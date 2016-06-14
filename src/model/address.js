var bookshelf = require('../common/db.js').bookshelf;

var address = bookshelf.Model.extend({
    tableName: 'address'
});

module.exports = address;
