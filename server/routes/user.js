const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user');
const User = require('../models/user');
const check = require('express-validator');

router.post(
  '/signup',
  [
    check.query('username', 'Invalid username!')
      .trim()
      .isLength({ min: 5 })
      .custom((value, { req }) => {
        return User.findOne({ username: value })
          .then(userDoc => {
            if(userDoc) {
              return Promise.reject('Username exists!')
            };
          });
      }),
    check.query('password', 'Invalid password!')
      .trim()
      .isLength({ min: 5 })
  ],
  userControllers.postSignup
);

router.post(
  '/login',
  [
    check.query('username', 'Invalid username!')
      .trim()
      .isLength({ min: 5 }),
    check.query('password', 'Invalid password!')
      .trim()
      .isLength({ min: 5 })
  ],
  userControllers.postLogin
);

module.exports = router;