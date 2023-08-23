const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const registerUser = require('./handlers/registerUser');
const loginUser = require('./handlers/loginUser');
const createBudgetEntry = require('./handlers/createBudgetEntry');
const fetchBudgetEntries = require('./handlers/fetchBudgetEntries');
const editBudgetEntry = require('./handlers/editBudgetEntry');
const deleteBudgetEntry = require('./handlers/deleteBudgetEntry');
const authenticateToken = require('./middlewares/authenticateToken');

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
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.post('/api/budget-entries', authenticateToken, createBudgetEntry);
app.get('/api/budget-entries', authenticateToken, fetchBudgetEntries);
app.put('/api/budget-entries/:id', authenticateToken, editBudgetEntry);
app.delete('/api/budget-entries/:id', authenticateToken, deleteBudgetEntry);

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', error: 'An error occurred' });
});

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
