var bookshelf = require('../common/db.js').bookshelf;
var PackageStatus = require('./package_status');
var Branch = require('./branch');

var package = bookshelf.Model.extend({
    tableName: 'package',
    status: function() {
        return this.belongsTo(PackageStatus);
    },
    originBranch: function() {
        return this.belongsTo(Branch, 'origin_branch_id');
    }
});

module.exports = package;
