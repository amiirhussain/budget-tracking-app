const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user');
const { budgetRouter } = require('./routes/budget');

const router = express.Router();

const app = express();
const PORT = 1337;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/budget-tracker-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error));

// Routes
app.use(router);
router.use('/api/user', userRouter);
router.use('/api/budget-entries', budgetRouter);

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', error: 'An error occurred' });
});

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
