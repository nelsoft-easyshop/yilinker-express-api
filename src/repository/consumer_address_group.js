var CAG = require('../model/consumer_address_group');

/**
 * Retrieves a consumer address grouping (Recipient) by consumer
 * @param  {string}     consumerId      Target Consumer
 * @return {Promise}                    Promise resolving to a CAG id
 */
module.exports.findRecipientGroupByConsumer = function(consumerId){
    return CAG.forge({
        consumer_id: consumerId,
        name: 'Recipient', // both pertains to recipient
        address_group_id: 4
    })
    .fetch({
        columns: ['id'],
        require: true
    })
    .then(function(group){
        return group.toJSON().id;
    });
};
