var router = require('express').Router();

// require same level directories
var waybill = require('./waybill');

// set routes
router.use('/waybill', waybill);

module.exports = router;
