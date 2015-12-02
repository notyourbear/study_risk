var express = require('express');
var router = express.Router();
var qCtrl = require('../controllers/questions.js');

router.get('/question', qCtrl.single);

module.exports = router;