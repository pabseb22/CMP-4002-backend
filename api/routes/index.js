const express = require('express');
const router = express.Router();

const IndexController = require('../controllers/index');


router.get('/example', IndexController.example);

router.post('/encript', IndexController.encript);

router.post('/login', IndexController.login);

router.get('/get-items', IndexController.getItems);

router.post('/add-item', IndexController.addItem);

router.post('/edit-item', IndexController.editItem);

router.post('/subscribe-to-item', IndexController.subscribeItem);

router.post('/unsubscribe-to-item', IndexController.unsubscribeItem);

router.get('/get-auctions', IndexController.getAuction);

router.post('/add-auction', IndexController.addAuction);

router.post('/end-auction', IndexController.endAuction);

router.post('/add-bid', IndexController.addBid);

module.exports = router;
