'use strict';

var repoPath = '../../repository/';
var base = require('../base_controller');
var checkit = require('checkit');
var clientApiSettingRepo = require(repoPath + 'client_api_setting');
var waybillQueue = require('../../common/queue').waybillQueue;

var formObject = require('../../form/waybill/create_waybill_form');
var waybillCreateForm = formObject.form;
var waybillErrorCodes = formObject.errorCodes;

/**
 * @api {post} waybill/create Create Waybill
 * @apiDescription Endpoint for creating a waybill
 * @apiName waybillCreate
 * @apiGroup Waybill
 * @apiVersion 1.0.0
 
 * @apiExample {curl} Example usage:
 *     curl -X POST https://sandbox-express.yilinker.com/v1/waybill/create \
 *          -H "Content-Type: application/json" \
 *          -u <client_key>:<client_secret> \
 *          -d '{ 
 *              "consignee_address": {
 *                  "complete_address": "1000 Jose P Laurel Sr, San Miguel, Manila, Metro Manila",
 *                  "province": "Metro Manila",
 *                  "city": "Manila",
 *                  "barangay": "San Miguel",
 *                  "street_address": "1000 Jose P Laurel Sr"
 *              }, 
 *              "consignee_name": "Normie Ree", 
 *              "consignee_contact_number": "639000000000", 
 *              "is_cod": true, 
 *              "declared_value": 123.45, 
 *              "package_description": "Crimson Web Karambit", 
 *              "amount_to_collect": 678.90,
 *              "callback_url": "https://example.com/waybill/receive" 
 *          }'
 *
 * @apiParam    (Parameters)    {Object}                                            consignee_address                   Consignee Address Object
 * @apiParam    (Parameters)    {String{max of 300 chars}}                          consignee_address.complete_address  Consignee's Complete Address
 * @apiParam    (Parameters)    {String{max of 50 chars}}                           consignee_address.province          Province the consignee address is located in
 * @apiParam    (Parameters)    {String{max of 50 chars}}                           consignee_address.city              City the consignee address is located in
 * @apiParam    (Parameters)    {String{max of 50 chars}}                           consignee_address.barangay          Barangay the consignee address is located in
 * @apiParam    (Parameters)    {String{max of 150 chars}}                          consignee_address.street_address    Street address of consignee
 * @apiParam    (Parameters)    {String{max of 150 chars}}                          consignee_name                      Consignee's Name
 * @apiParam    (Parameters)    {String{max of 150 chars}}                          consignee_contact_number            Consignee's Contact Number
 * @apiParam    (Parameters)    {Decimal{max of 11 whole and 2 decimal digits}}     declared_value                      Shipment's Value
 * @apiParam    (Parameters)    {String{max of 500 chars}}                          package_description                 Brief Description of Package
 * @apiParam    (Parameters)    {Boolean=true, false}                               is_cod                              Is Waybill to be tagged as Cash On Delivery?
 * @apiParam    (Parameters)    {String{max of 300 chars}}                          [callback_url]                      A valid URL where the details of generated waybill should be sent
 * @apiParam    (Parameters)    {Decimal{max of 11 whole and 2 decimal digits}}     [amount_to_collect]                 Amount to collect (Required if COD)
 * @apiParam    (Parameters)    {String{max of 50 chars}}                           [reference_number]                  Any value that would be binded to this waybill
 *
 * @apiParam    (Callback)      {String}                                            waybill_number                      Waybill Number
 * @apiParam    (Callback)      {String}                                            reference_number                    Reference number binded on request
 * @apiParam    (Callback)      {String}                                            waybill_status_name                 Initial Waybill Status Name
 * @apiParam    (Callback)      {Number}                                            waybill_status_value                Initial Waybill Status Value
 * 
 * @apiSuccess  (Success)       {String}                                            status                              State of response
 * @apiSuccess  (Success)       {Object}                                            data                                Data object
 *
 * @apiSuccessExample Success (Response):
 *     HTTP/1.1 200 OK
 *     {
 *         "status": "successful",
 *         "data": null,
 *         "message": ""
 *     }
 *
 * @apiSuccessExample Callback (Request):
 *     POST {callback_url} HTTP/1.1
 *     X-YLX-Signature: sample_hash
 *     {
 *         "data": {
 *             "waybill_number": "WBEPH000100000000000",
 *             "reference_number": {reference_number},
 *             "waybill_status_name": "For Verification",
 *             "waybill_status_value": 15
 *         }
 *     }
 *
 * @apiError    (Error 400)     {String}                        status                      State of response      
 * @apiError    (Error 400)     {Object}                        data                        Data Object      
 * @apiError    (Error 400)     {String[]}                      data.errors                 Array of error codes      
 * @apiError    (Error 400)     {String}                        message                     Human Readable Error
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
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
    return waybillCreateForm
    .run(req.body)
    .then(function(validatedData){
        return clientApiSettingRepo
        .getClientAPISettings(req.clientId)
        .then(function(settings){
            if(settings.default_address_id){
                // attach consumer id
                settings.consumer_id = req.consumerId;

                // queue job here
                // use req.body since checkit has a bug that does not return nested objects
                waybillQueue.add(Object.assign({}, settings, req.body));
                return Promise.resolve();
            }
            throw new Error(waybillErrorCodes.api_address.required);
        });
    })
    .then(function(){
        res.json(
            base.response(res)
        );
    })
    .catch(function(e){ return e.message === waybillErrorCodes.api_address.required; }, function(err){
        err = new checkit.Error();
        err.errors = { missing_shipper_addr: { message: waybillErrorCodes.api_address.required } };
        throw err;
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
