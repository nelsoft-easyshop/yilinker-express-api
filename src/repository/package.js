var Package = require('../model/package');
var knex = require('../common/db').knex;
var self = this;

var constants = {
    defaultPackageCreationType: 6, // value, from client api
    defaultPackageStatus: 15, // value, for verif
    defaultPackageTransactionType: 1, // id, Pick-up
    defaultPouchType: 1, // pouch_order, Small Pouch
    defaultPackageCount: 1, // constant
    defaultWaybillNumber: 'WBEPH', // waybillnumber holder
    defaultChargeConsumerType: 1, // charge to client
    defaultLength: 0,
    defaultWidth: 0,
    defaultHeight: 0,
    defaultWeight: 0,
    waybillLength: 11
};

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

module.exports.getPackageDefaultValues = function(){
    var defaultValues = {};
    return self.getMainBranch().then(function(result){
        defaultValues.origin_branch_id = result[0].id;
        defaultValues.current_branch_id = result[0].id;
        return self.getPackageCreationType(constants.defaultPackageCreationType);
    })
    .then(function(result){
        defaultValues.package_creation_type_id = result[0].id;
        return self.getPackageStatus(constants.defaultPackageStatus);
    })
    .then(function(result){
        defaultValues.package_status_id = result[0].id;
        return self.getPackageTransactionType(constants.defaultPackageTransactionType);
    })
    .then(function(result){
        defaultValues.package_transaction_type_id = result[0].id;
        return self.getPouchType(constants.defaultPouchType);
    })
    .then(function(result){
        defaultValues.pouch_type_id = result[0].id;
        var date = new Date();
        return Object.assign(
            defaultValues,
            {
                package_count: constants.defaultPackageCount,
                waybill_number:  constants.defaultWaybillNumber,
                charge_consumer_type: constants.defaultChargeConsumerType,
                weight: constants.defaultWeight,
                length: constants.defaultLength,
                width: constants.defaultWidth,
                height: constants.defaultHeight,
                date_added: date,
                last_date_modified: date
            }
        );
    });
};

/**
 * Orchestrates the recipient address generation process
 * @param  {int}    consumerId          Valid Consumer ID
 * @param  {Object} consigneeDetails    Contains consignee name, contactNumber and address
 * @return {Promise}                 
 */
module.exports.createConsigneePackageAddress = function(consumerId, consigneeDetails){
    var addressRepository = require('./address');
    // Step 1: Create Address entry
    return addressRepository
    .createAddress(consigneeDetails.address)
    .then(function(addressId){
        // Step 2: Create Consumer Address
        var consumerAddressRepoitory = require('./consumer_address');
        return consumerAddressRepoitory.createConsumerAddress(
            addressId,
            consumerId,
            consigneeDetails
        );
    })
    .then(function(consumerAddressId){
        // Step 3: Retrieve Consumer Address Group
        var consumerAddressGroupRepository = require('./consumer_address_group');
        return consumerAddressGroupRepository.findRecipientGroupByConsumer(consumerId)
        .then(function(consumerAddrGroupId){
            // Step 4: generate consumer address grouping
            var consumerAddressGroupingRepository = require('./consumer_address_grouping');
            return consumerAddressGroupingRepository.createConsumerAddressGrouping(
                consumerAddrGroupId,
                consumerAddressId,
                consumerId
            );
        });
    });
};

module.exports.createPackage = function(packageData){
    return Package
    .forge(packageData)
    .save()
    .then(function(package){
        return package.toJSON();
    });
};

module.exports.updateWaybillNumber = function(packageId){
    return Package.forge({
        id: packageId
    })
    .fetch({
        withRelated: [{'originBranch': function(qb){
            qb.column('id', 'name', 'code');
        }}],
        columns: ['waybill_number', 'origin_branch_id'],
        require: true
    })
    .then(function(packageData){
        data = packageData.toJSON();
        waybill = 'WBEPH' + data.originBranch.code + String('00000000000' + data.id).slice(-constants.waybillLength);
        return packageData.save({
            waybill_number: waybill
        })
        .then(function(packageData){
            return packageData.toJSON();
        });
    });
};


/**
 * Query Helpers
 */

self.getMainBranch = function(){
    return knex('branch').select('id').where('is_main', 1).limit(1);
};

self.getPackageCreationType = function(value){
    return knex('package_creation_type').select('id').where('value', value).limit(1);
};

self.getPackageStatus = function(value){
    return knex('package_status').select('id').where('value', value).limit(1);
};

self.getPackageTransactionType = function(value){
    return knex('package_transaction_type').select('id').where('id', value).limit(1);
};

self.getPouchType = function(value){
    return knex('pouch_type').select('id').where('pouch_order', value).limit(1);
};
