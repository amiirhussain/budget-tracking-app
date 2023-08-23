const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const JWT_SECRET = 'secret123';

module.exports = async (req, res, next) => {
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
