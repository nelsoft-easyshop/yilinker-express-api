'use strict';

var util = require('util');
var Queue = require('bull');
var params = require('../../app/config/parameters').redis;

var waybillSendQueue = Queue('Waybill Request Queue', params.port, params.host);

module.exports.waybillQueue = waybillSendQueue;
