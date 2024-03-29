'use strict';

var base = require('../base_controller');
var checkit = require('checkit');
var repoPath = '../../repository/';
var waybillCreateForm = require('../../form/waybill/create_waybill_form').form;
var packageRepo = require(repoPath + '/package');
var consumerAddressRepo = require(repoPath + '/consumer_address');
var clientApiSettingRepo = require(repoPath + '/client_api_setting');

/**
 * @api {post} waybill/create Create Waybill
 * @apiDescription Endpoint for creating a waybill
 * @apiName waybillCreate
 * @apiGroup Waybill
 * @apiVersion 1.0.0
 
 * @apiExample {curl} Example usage:
 *     curl -X POST https://sandbox-express.yilinker.com/waybill/create \
 *          -H "Content-Type: application/json" \
 *          -u <client_key>:<client_secret> \
 *          -d '{ 
 *              "consignee_address": "221 B Baker St.", 
 *              "consignee_name": "Alan Turing", 
 *              "consignee_contact_number": "639000000000", 
 *              "is_cod": true, 
 *              "declared_value": 123.45, 
 *              "package_description": "Smaug 1:1 Replica", 
 *              "amount_to_collect": 678.90 
 *          }'
 *
 * 
 * @apiParam    (Parameters)    {String{max of 300 chars}}                          consignee_address           Consignee's Address
 * @apiParam    (Parameters)    {String{max of 150 chars}}                          consignee_name              Consignee's Name
 * @apiParam    (Parameters)    {String{max of 150 chars}}                          consignee_contact_number    Consignee's Contact Number
 * @apiParam    (Parameters)    {Decimal{max of 11 whole and 2 decimal digits}}     declared_value              Shipment's Value
 * @apiParam    (Parameters)    {String{max of 500 chars}}                          package_description         Brief Description of Package
 * @apiParam    (Parameters)    {Boolean=true, false}                               is_cod                      Is Package to be tagged as Cash On Delivery?
 * @apiParam    (Parameters)    {Decimal{max of 11 whole and 2 decimal digits}}     [amount_to_collect]         Amount to collect (Required if COD)
 * @apiParam    (Parameters)    {String{max of 50 chars}}                           [reference_number]          Any value that would be binded to this waybill
 *
 * 
 * @apiSuccess  (Success 200)   {String}                        status                      State of response
 * @apiSuccess  (Success 200)   {Object}                        data                        Data object
 * @apiSuccess  (Success 200)   {String}                        data.waybill_number         Waybill Number assigned by the system
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": "successful",
 *         "data": {
 *             "waybill_number": "WBEPH000100000000000",
 *         },
 *         message: ""
 *     }
 *
 * @apiError    (Error 400)     {String}                        status                      State of response      
 * @apiError    (Error 400)     {Object}                        data                        Data Object      
 * @apiError    (Error 400)     {String[]}                      data.errors                 Array of error codes      
 * @apiError    (Error 400)     {String}                        message                     Human Readable Error
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "failed",
 *       "data": {
 *           "errors": [
 *               "4000",
 *               "7001"
 *           ]
 *       },
 *       "message": "Malformed Request Parameters"
 *     }
 * 
 */
module.exports = function(req, res, next){
    waybillCreateForm
    .run(req.body)
    .then(function(validatedData){
        // generate defaults
        return packageRepo
        .getPackageDefaultValues()
        .then(function(defaultValues){
            var packageData = defaultValues;
            // create address
            return packageRepo.createConsigneePackageAddress(
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
                })
                .catch(function(e){ return e.code === 'ER_BAD_NULL_ERROR'; }, function(err){
                    err = new checkit.Error();
                    err.errors = { missing_shipper_addr: { message: '8000' } };
                    throw err;
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
    })
    .catch(function(err){
        next(err);
    });
};
