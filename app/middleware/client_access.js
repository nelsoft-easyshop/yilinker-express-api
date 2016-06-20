'use strict';

var clientRepo = require('../../src/repository/client');
var auth = require('basic-auth');

/**
 * Based on https://en.wikipedia.org/wiki/Basic_access_authentication
 */
module.exports = function(req, res, next){
    var client = auth(req);
    if(client !== undefined){
        clientRepo
        .findOneByCredentials(client.name, client.pass)
        .then(function(client){
            // bind client and consumer id to req
            req.clientId = client.clientId;
            req.consumerId = client.consumerId;
            next();
        })
        .catch(function(){
            res.status(401);
            res.json({
                status: 'failed',
                data: null,
                message: 'Invalid Authorization Code'
            });
        });
    }    
    else{
        res.status(401);
        res.json({
            status: 'failed',
            data: null,
            message: 'Invalid Authorization Code'
        });
    }
};
