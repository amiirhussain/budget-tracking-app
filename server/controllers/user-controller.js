const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const JWT_SECRET = 'secret123';

exports.registerUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Duplicate email' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      budget: req.body.budget,
      email: req.body.email,
      password: hashedPassword,
    });
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
};

// login
exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ status: 'error', error: 'Invalid login' });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (isPasswordValid) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        JWT_SECRET,
      );

      return res.json({ status: 'ok', user: token });
    } else {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid password' });
    }
  } catch (err) {
    next(err);
  }
};
