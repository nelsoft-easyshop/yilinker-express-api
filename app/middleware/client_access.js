'use strict';

var clientRepo = require('../../src/repository/client');

/**
 * Generate client_id and client secret!
 * 1) hide client_id and secret in branch
 * 2) show client_id and secret in client page
 * 3) generate client_secret for each existing client then update client model manager to auto include secret generation
 *
 * 
 * then just use https://en.wikipedia.org/wiki/Basic_access_authentication but over TLS of course
 * to use auth even on GET so that we can filter by request AND ID
 */

module.exports = function(req, res, next){
    var auth = req.get('Authorization');
    if (auth){
        clientRepo
            .findOneByClientKey(auth)
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
