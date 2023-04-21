const User = require('../models/user');
const check = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignup = async(req, res, next) => {
  const { username, password } = req.query;
  const errors = check.validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg })
  };

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User(
      {
        username: username,
        password: hashedPassword
      }
    );
    await user.save();
    return res.status(200).json({ message: username + ' create success', data: user });
  } catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
      next(err);
    };
  };
};

exports.postLogin = async(req, res, next) => {
  const { username, password } = req.query;
  const errors = check.validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg })
  };

  try {
    const user = await User.findOne({ username: username });
    const doMatch = await bcrypt.compare(password, user.password);
    if(!doMatch) {
      return res.status(422).json({ message: 'Invalid username or password!' });
    };
    const token = jwt.sign(
      { id: user._id, username: user.username },
      'your_secret_key'
    );
    return res.status(200).json({
      message: username + ' login success!',
      data: {
        ...user._doc,
        token: token
      }
    });
  } catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
      next(err);
    };
  };
};

exports.postResetPassword = async(req, res, next) => {

}