var bookshelf = require('../common/db.js').bookshelf;
var packageStatus = require('./package_status');

var package = bookshelf.Model.extend({
    tableName: 'package',
    status: function() {
        return this.belongsTo(packageStatus);
    }
});

module.exports = package;
