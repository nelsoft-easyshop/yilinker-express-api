'use strict';

var Queue = require('bull');
var params = require('../../app/config/parameters.json').redis;
var queueName = process.env.WB_QNAME || 'wb_test_queue';

var waybillSendQueue = Queue(queueName, params.port, params.host);

module.exports.waybillQueue = waybillSendQueue;
