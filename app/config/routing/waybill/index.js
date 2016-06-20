var router = require('express').Router();

// require controller
var waybill = require('../../../../src/controller/waybill');

// require access middleware
var clientAccess = require('../../../middleware/client_access');

router.get('/details/:waybill', clientAccess, waybill.getStatus);
router.post('/create', clientAccess, waybill.create);

module.exports = router;
