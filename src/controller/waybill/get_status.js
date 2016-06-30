'use strict';

/**
 *  Dependencies
 */
var base = require('../base_controller');
var repoPath = '../../repository/';

/**
 * @api {get} waybill/details/<waybill> Get Waybill Status
 * @apiDescription Endpoint for retrieving a particular waybill's status
 * @apiName getWaybillStatus
 * @apiGroup Waybill
 * @apiVersion 1.0.0
 * 
 * @apiExample {curl} Example usage:
 *     curl -X GET https://sandbox-express.yilinker.com/v1/waybill/details/<waybill> \
 *          -u <client_key>:<client_secret>
 *     
 * @apiParam    (Query) {String}     waybill_number         Package's Waybill Number
 *
 * @apiSuccess  (Success 200)   {String}     status                 State of response
 * @apiSuccess  (Success 200)   {Object}     data                   Data object
 * @apiSuccess  (Success 200)   {String}     data.waybill_number    Waybill Number
 * @apiSuccess  (Success 200)   {String}     data.status_name       Status of Waybill
 * @apiSuccess  (Success 200)   {Number}     data.status_value      Status Code of Waybill
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": "successful",
 *         "data": {
 *             "waybill_number": "WBEPH000100000000000",
 *             "status_name": "Received by Recipient",
 *             "status_value": 90
 *         },
 *         message: ""
 *     }
 *
 * @apiError    (Error 404)   {String}    status                  State of response
 * @apiError    (Error 404)   {Object}    data                    Data object
 * @apiError    (Error 404)   {String}    message                 Human Readable Error
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status": "failed",
 *       "data": null,
 *       "message": "No Entry Found"
 *     }
 */
module.exports = function(req, res, next){
    var packageRepo = require(repoPath + 'package');
    var waybill = req.params.waybill;
    if(waybill){
        waybill = waybill.trim();
        return packageRepo
            .getWaybillStatus(waybill, req.consumerId)
            .then(function(data){
                res.json(base.response(
                    res,
                    data
                ));
            })
            .catch(function(){
                res.json(base.noEntryFound(res));
            });
    }
    else{
        res.json(base.noEntryFound(res));
    }
};
