const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BudgetEntry = require('./models/BudgetEntry');

app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/budget-tracker-app')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Failed to connect to MongoDB:', error);
  });

const authenticateToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ status: 'error', error: 'Unauthorized' });
  }

  jwt.verify(token, 'secret123', (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'error', error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

app.post('/api/budget-entries', authenticateToken, async (req, res) => {
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
    console.error('Error saving budget entry:', err);
    res.status(500).json({ status: 'error', error: 'An error occurred' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json({ status: 'error', error: 'Duplicate email' });
    }

    const newPassword = await bcrypt.hash(req.body.password, 10);

    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      budget: req.body.budget,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: 'ok' });
  } catch (err) {
    res.json({ status: 'error', error: 'An error occurred' });
  }
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ status: 'error', error: 'Invalid login' });
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
      'secret123',
    );

    return res.json({ status: 'ok', user: token });
  } else {
    return res.json({ status: 'error', user: false });
  }
});

app.get('/api/budget-entries', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    const budgetEntries = await BudgetEntry.find({ user: user._id });
    return res.json({ status: 'ok', budgetEntries });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: 'An error occurred' });
  }
});

app.put('/api/budget-entries/:id', authenticateToken, async (req, res) => {
  try {
    // Find the entry by ID
    const entry = await BudgetEntry.findById(req.params.id);

    if (!entry) {
      return res
        .status(404)
        .json({ status: 'error', error: 'Entry not found' });
    }

    // Update the entry fields
    entry.name = req.body.name;
    entry.date = req.body.date;
    entry.price = req.body.price;

    // Save the updated entry
    await entry.save();

    res.json({ status: 'ok', message: 'Budget entry updated.' });
  } catch (err) {
    console.error('Error updating budget entry:', err);
    res.status(500).json({ status: 'error', error: 'An error occurred' });
  }
});

// delete
app.delete('/api/budget-entries/:id', authenticateToken, async (req, res) => {
  try {
    const entryId = req.params.id;

    console.log(entryId);
    // Find the entry by ID
    await BudgetEntry.findByIdAndRemove(entryId);

    res.json({ status: 'ok', message: 'Budget entry deleted.' });
  } catch (err) {
    console.error('Error deleting budget entry:', err);
    res.status(500).json({ status: 'error', error: 'An error occurred' });
  }
});

// user budget limit

// app.get('/api/budget-trend/:period', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.user.email });
//     if (!user) {
//       return res.status(404).json({ status: 'error', error: 'User not found' });
//     }

//     const period = req.params.period;
//     let startDate = new Date();

//     switch (period) {
//       case '1month':
//         startDate.setMonth(startDate.getMonth() - 1);
//         break;
//       case '6months':
//         startDate.setMonth(startDate.getMonth() - 6);
//         break;
//       case '12months':
//         startDate.setMonth(startDate.getMonth() - 12);
//         break;
//       default:
//         return res
//           .status(400)
//           .json({ status: 'error', error: 'Invalid period' });
//     }

//     const budgetEntries = await BudgetEntry.find({
//       user: user._id,
//       date: { $gte: startDate },
//     }).sort({ date: 1 });

//     // Process the data to group by month and calculate total expenses...

//     return res.json({ status: 'ok', trendData: budgetEntries });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: 'error', error: 'An error occurred' });
//   }
// });

app.listen(1337, () => {
  console.log('Server started on port 1337');
});
