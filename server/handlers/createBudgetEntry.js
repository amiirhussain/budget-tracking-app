const User = require('../models/user.model');
const BudgetEntry = require('../models/BudgetEntry');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    const newBudgetEntry = new BudgetEntry({
      user: user._id,
      name: req.body.name,
      date: req.body.date,
      price: req.body.price,
    });

    await newBudgetEntry.save();
    res.json({ status: 'ok', message: 'Budget entry saved.' });
  } catch (err) {
    next(err);
  }
};
