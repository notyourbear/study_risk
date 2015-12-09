var express = require('express');
var router = express.Router();
var listCtrl = require('../controllers/list.js');

router.post('/', listCtrl.create);

router.get('/', listCtrl.all);
router.get('/user', listCtrl.userLists);

router.delete('/delete/:id', listCtrl.destroy);

router.get('/:id', listCtrl.single);

module.exports = router;