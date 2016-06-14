var CAGing = require('../model/consumer_address_grouping');

/**
 * Creates consumer address grouping entry (defaults to recipient)
 * @param  {int} CAGId       valid Consumer Address Group id
 * @param  {int} CAId        valid Consumer Address id
 * @param  {int} consumerId  valid Consumer id
 * @return {Promise}         Promise resolving to created CAGing id          
 */ 
module.exports.createConsumerAddressGrouping = function(CAGId, CAId, consumerId){
    return CAGing.forge({
        consumer_address_group_id: CAGId,
        consumer_address_id: CAId,
        consumer_id: consumerId,
        group_name: 'Recipient'
    })
    .save()
    .then(function(grouping){
        return grouping.toJSON();
    });
};
