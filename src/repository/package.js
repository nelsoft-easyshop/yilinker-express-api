var Package = require('../model/package');

/**
 * Retrieves waybill status as per spec
 * @param  {string}     waybill     Waybill of package to query
 * @return {Promise}
 */
module.exports.getWaybillStatus = function(waybill, consumerId){
    return Package.forge({
        waybill_number: waybill,
        sender_consumer_id: consumerId
    })
    .fetch({
        withRelated: [{'status': function(qb){
            qb.column('id', 'name', 'value');
        }}],
        columns: ['waybill_number', 'package_status_id'],
        require: true
    })
    .then(function(package){
        package = package.toJSON();
        return {
            waybill_number: package.waybill_number,
            status_name: package.status.name,
            status_value: package.status.value
        };
    });
};
