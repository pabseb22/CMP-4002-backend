const express = require('express');
const router = express.Router();

const IndexController = require('../controllers/index');


router.get('/example', IndexController.example);

router.post('/encript', IndexController.encript);

router.post('/login', IndexController.login);

router.get('/get-events', IndexController.getEvents);

router.post('/get-event-categories', IndexController.getEventCategories);

router.post('/register-user-to-event', IndexController.registerUserToEvent);

router.post('/get-event-results', IndexController.getResultsByEventId);

module.exports = router;
