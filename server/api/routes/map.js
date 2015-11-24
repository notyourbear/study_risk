var express = require('express');
var router = express.Router();
var mapCtrl = require('../controllers/map.js');

router.get('/access', mapCtrl.token);

router.get('/states/:name', mapCtrl.state);

module.exports = router;