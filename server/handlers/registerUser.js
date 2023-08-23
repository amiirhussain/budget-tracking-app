const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
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
