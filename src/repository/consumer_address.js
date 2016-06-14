var CA = require('../model/consumer_address');

/**
 * Creates a consumer address entry
 * @param  {int} address_id             Valid Address id
 * @param  {int} consumerId             Valid consumer id
 * @param  {Object} consigneeDetails    Consignee name and number
 * @return {Promise}                    Promise resolving to created CA id
 */
module.exports.createConsumerAddress = function(addressId, consumerId, consigneeDetails){
    return CA.forge({
        address_id: addressId,
        consumer_id: consumerId,
        is_permanent: 0,
        contact_person: consigneeDetails.name,
        contact_person_number: consigneeDetails.contactNumber
    })
    .save()
    .then(function(consumerAddress){
        return consumerAddress.toJSON().id;
    });
};

module.exports.getAddressByConsumerAddress = function(consumerAddressId){
    return CA.forge({
        id: consumerAddressId
    })
    .fetch({
        columns: ['id', 'address_id'],
        require: true
    })
    .then(function(consumerAddress){
        return consumerAddress.toJSON();
    });
};
