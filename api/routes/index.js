const express = require('express');
const router = express.Router();

const IndexController = require('../controllers/index');


router.get('/example', IndexController.example);

router.post('/encript', IndexController.encript);

router.post('/login', IndexController.login);

module.exports = router;
