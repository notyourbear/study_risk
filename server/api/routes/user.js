var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user.js');

router.post('/', userCtrl.create);
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);

router.get('/', userCtrl.all);

module.exports = router;