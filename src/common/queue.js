'use strict';

var Queue = require('bull');
var params = require('../../app/config/parameters.json').redis;

var waybillSendQueue = Queue('Waybill Request Queue', params.port, params.host);

module.exports.waybillQueue = waybillSendQueue;
