'use strict';

/**
 *  Dependencies
 */
var base = require('../base_controller');
var repoPath = '../../repository/';

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
module.exports = function(req, res, next){
    var packageRepo = require(repoPath + 'package');
    var waybill = req.params.waybill;
    if(waybill){
        waybill = waybill.trim();
        packageRepo
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
