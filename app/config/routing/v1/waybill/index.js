var router = require('express').Router();

// require controller
var waybill = require('../../../../../src/controller/waybill');

// setup waybill endpoints
router.get('/details/:waybill', waybill.getStatus);
router.post('/create', waybill.create);

module.exports = router;
