// server.js
const express = require('express');
const session = require('express-session');
const passport = require('./auth');
const pool = require('./db');
const bcrypt = require('bcrypt');
const app = express();

// Middleware
app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key', // Replace with a secure key
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Registration Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const userExists = await pool.query('SELECT 1 FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [
      username,
      passwordHash,
    ]);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Login Route
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in successfully.' });
});

// Protected Route
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: `Welcome, ${req.user.username}` });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Logout Route
app.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully.' });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});