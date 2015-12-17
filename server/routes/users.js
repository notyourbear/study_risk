var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', userCtrl.profile);

module.exports = router;
