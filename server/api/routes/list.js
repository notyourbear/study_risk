var express = require('express');
var router = express.Router();
var listCtrl = require('../controllers/list.js');

router.post('/', listCtrl.create);

router.get('/', listCtrl.all);

module.exports = router;