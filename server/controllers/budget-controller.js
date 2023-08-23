// create
const User = require('../models/user.model');
const BudgetEntry = require('../models/BudgetEntry');

// fetch
const fetchBudgetEntries = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    const budgetEntries = await BudgetEntry.find({ user: user._id });
    return res.json({ status: 'ok', budgetEntries });
  } catch (error) {
    next(error);
  }
};

// create
const createBudgetEntry = async (req, res, next) => {
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

// delete

const deleteBudgetEntry = async (req, res, next) => {
  try {
    const entryId = req.params.id;
    await BudgetEntry.findByIdAndRemove(entryId);
    res.json({ status: 'ok', message: 'Budget entry deleted.' });
  } catch (err) {
    next(err);
  }
};

// update
const editBudgetEntry = async (req, res, next) => {
  try {
    const entry = await BudgetEntry.findById(req.params.id);

    if (!entry) {
      return res
        .status(404)
        .json({ status: 'error', error: 'Entry not found' });
    }

    entry.name = req.body.name;
    entry.date = req.body.date;
    entry.price = req.body.price;

    await entry.save();
    res.json({ status: 'ok', message: 'Budget entry updated.' });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  fetchBudgetEntries,
  createBudgetEntry,
  deleteBudgetEntry,
  editBudgetEntry,
};
