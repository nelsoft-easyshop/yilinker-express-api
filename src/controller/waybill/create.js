'use strict';

var base = require('../base_controller');
var repoPath = '../../repository/';

module.exports = function(req, res, next){
    console.log(req.clientId);
    console.log(req.consumerId);
    res.send('here!');
};
