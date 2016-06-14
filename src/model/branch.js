var bookshelf = require('../common/db.js').bookshelf;

var branch = bookshelf.Model.extend({
    tableName: 'branch'
});

module.exports = branch;
