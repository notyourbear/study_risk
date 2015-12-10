var express = require('express');
var router = express.Router();
var rCtrl = require('../controllers/radio.js');

router.get('/', rCtrl.all);
router.get('/user', rCtrl.user);
router.post('/', rCtrl.create);
router.post('/list', rCtrl.associateWithList);
router.post('/removefromlist', rCtrl.removeFromList);
router.put('/', rCtrl.edit);
router.delete('/delete/:id', rCtrl.destroy);

module.exports = router;