var ClientApiSetting = require('../model/client_api_setting');

/**
 * Retrieves Client's default API Shipper Address
 * @param  {int}        clientId     Valid Client ID
 * @return {Promise}                 Resolves to client details
 */
module.exports.getClientAPIDefaultAddress = function(clientId){
    return ClientApiSetting.forge({
        client_id: clientId
    })
    .fetch({
        columns: ['id', 'default_address_id'],
        require: true
    })
    .then(function(client){
        return client.toJSON();
    });
};
