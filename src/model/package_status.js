var bookshelf = require('../common/db.js').bookshelf;

var packageStatus = bookshelf.Model.extend({
    tableName: 'package_status'
});

module.exports = packageStatus;
