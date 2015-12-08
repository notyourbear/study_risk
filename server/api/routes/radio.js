var express = require('express');
var router = express.Router();
var rCtrl = require('../controllers/radio.js');

router.get('/', rCtrl.all);
router.get('/user', rCtrl.user);
router.post('/', rCtrl.create);
router.post('/list', rCtrl.associateWithList);

module.exports = router;