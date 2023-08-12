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

app.post('/api/quote', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		await User.updateOne(
			{ email: email },
			{ $set: { quote: req.body.quote } }
		)

		return res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})


// app.post('/api/logout', (req, res) => {
//   // You can add code here to invalidate the token or perform any other necessary actions
//   res.json({ status: 'ok' });
// });


app.listen(1337, () => {
  console.log("Server started on port 1337");
});
