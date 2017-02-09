var express = require('express');
var router = express.Router();
var listCtrl = require('../controllers/list.js');

router.post('/', listCtrl.create);

router.get('/', listCtrl.all);
router.get('/user', listCtrl.userLists);
router.get('/quickPlay', listCtrl.quickPlay);

router.delete('/delete/:id', listCtrl.destroy);

router.get('/:id', listCtrl.single);

router.put('/', listCtrl.edit);

module.exports = router;
