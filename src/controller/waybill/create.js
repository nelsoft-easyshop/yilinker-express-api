'use strict';

var base = require('../base_controller');
var checkit = require('checkit');
var repoPath = '../../repository/';
var waybillCreateForm = require('../../form/waybill/create_waybill_form').form;
var packageRepo = require(repoPath + '/package');
var consumerAddressRepo = require(repoPath + '/consumer_address');
var clientApiSettingRepo = require(repoPath + '/client_api_setting');

/**
 * @api {post} /waybill/create Create Package Waybill
 * @apiVersion 0.1.0
 * @apiName WaybillCreate
 * @apiGroup Waybill
 *
 * @apiDescription Endpoint for generating waybill given a set of parameters.
 * 
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
module.exports = function(req, res, next){
    waybillCreateForm
    .run(req.body)
    .then(function(validatedData){
        // generate defaults
        packageRepo
        .getPackageDefaultValues()
        .then(function(defaultValues){
            var packageData = defaultValues;
            // create address
            packageRepo.createConsigneePackageAddress(
                req.consumerId,
                {
                    name: validatedData.consignee_name,
                    contactNumber: validatedData.consignee_contact_number,
                    address: validatedData.consignee_address
                }
            )
            .then(function(grouping){
                return consumerAddressRepo.getAddressByConsumerAddress(
                    grouping.consumer_address_id
                );
            })
            .then(function(consumerAddress){
                return clientApiSettingRepo
                .getClientAPIDefaultAddress(req.clientId)
                .then(function(client){
                    // finish package creation here
                    packageData.sender_address_id = client.default_address_id;
                    packageData.sender_consumer_id = req.consumerId;
                    packageData.recipient_address_id = consumerAddress.address_id;
                    packageData.reference_number_1 = validatedData.reference_number || '';
                    packageData.cod_is_for_collection = validatedData.is_cod;
                    packageData.amount_to_collect = validatedData.amount_to_collect || '0.00';
                    packageData.declared_value = validatedData.declared_value;
                    packageData.package_description = validatedData.package_description;
                    packageData.charge_to = req.clientId;
                    return packageRepo.createPackage(packageData);
                });
            })
            .then(function(packageObject){
                // update waybill number here
                return packageRepo.updateWaybillNumber(packageObject.id);
            })
            .then(function(packageObject){
                res.json(
                    base.response(
                        res,
                        {
                            waybill_number: packageObject.waybill_number
                        }
                    )
                );
            });
        });
    })
    .catch(checkit.Error, function(err){
        res.json(
            base.badRequestResponse(
                res,
                {
                    errors: err.map(function(list){ return list.message; })
                }
            )
        );
    });
};
