const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/budget-tracker-app")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error);
  });

  
  app.post('/api/register', async (req, res) => {
    console.log(req.body);
    try {
      const existingUser = await User.findOne({ email: req.body.email });
  
      if (existingUser) {
        // If a user with the same email already exists, send an error response.
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
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid login' });
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      'secret123'
    );

    return res.json({ status: 'ok', user: token });
  } else {
    return res.json({ status: 'error', user: false });
  }
});


app.listen(1337, () => {
  console.log("Server started on port 1337");
});
