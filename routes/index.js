var express = require('express');
var router = express.Router();
const passport = require('passport')
const LocalStrategey = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const userController = require('../controllers/userController');

// Configure local strategy
passport.use(
  new LocalStrategey(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username })

      if(!user) {
        return done(null, false, { message: 'Incorrect username' })
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if(err) {
          throw new Error();
        }

        if(res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err)
  }
})

// GET homepage
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Members Only'
  });
});

// GET user sign up form
router.get('/sign-up', userController.user_create_get);

// POST user sign up form
router.post('/sign-up', userController.user_create_post);

router.get('/log-in', userController.user_login_get);

router.post('/log-in', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/log-out', (req, res, next) => {
  req.logout(function(err) {
    if(err) {
      next(err)
    }
    res.redirect('/')
  });
});

module.exports = router;
