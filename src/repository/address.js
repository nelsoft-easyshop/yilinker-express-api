var Address = require('../model/address');

/**
 * Creates an Address entry with street
 * @param  {string} street  Complete address of recipient
 * @return {Promise}        Promise resolving to address id created        
 */
module.exports.createAddress = function(street){
    return Address.forge({
        street : street,
        date_added: new Date()
    })
    .save()
    .then(function(addr){
        return addr.toJSON().id;
    });
};
