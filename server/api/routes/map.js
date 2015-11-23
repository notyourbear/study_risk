var express = require('express');
var router = express.Router();
var mapCtrl = require('../controllers/map.js');

router.get('/access', mapCtrl.token);

module.exports = router;