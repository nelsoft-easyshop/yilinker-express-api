var bookshelf = require('../common/db.js').bookshelf;

var clientApiSetting = bookshelf.Model.extend({
    tableName: 'client_api_setting'
});

module.exports = clientApiSetting;
