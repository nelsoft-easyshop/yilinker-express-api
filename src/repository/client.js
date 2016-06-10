var Client = require('../model/client');

/**
 * Retrieves a Client model by client_key
 * @param  {string}     key     Client key
 * @return {Promise}
 */
module.exports.findOneByClientKey = function(key){
    return Client.forge({
        client_key: key
    })
    .fetch({
        columns: ['id', 'consumer_id', 'name'],
        require: true
    })
    .then(function(client){
        client = client.toJSON();
        return {
            clientId: client.id,
            consumerId: client.consumer_id
        };
    });
};
