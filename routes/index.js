var express = require('express');
var router = express.Router();
const LocalStrategey = require('passport-local').Strategy

const userController = require('../controllers/userController');
const expressAsyncHandler = require('express-async-handler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only' });
});

router.get('/sign-up', userController.user_create_get);

router.post('/sign-up', userController.user_create_post);

module.exports = router;
