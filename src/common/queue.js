'use strict';

var util = require('util');
var Queue = require('bull');
var params = require('../../app/config/parameters').redis;

var waybillSendQueue = Queue('Waybill Request Queue', {
    url: util.format('redis://%s:%s/%s', params.host, params.port, params.db_number)
});

module.exports.waybillQueue = waybillSendQueue;
