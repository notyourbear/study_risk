var express = require('express');
var router = express.Router();
var indexCtrl = require('../controllers/index');

/* GET home page. */
router.get('/game/:id', indexCtrl.game);

router.get('/test', indexCtrl.test);

module.exports = router;
