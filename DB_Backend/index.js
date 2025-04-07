const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/EyeTrackerTest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// const calibrationDataSchema = new mongoose.Schema({
//   calibrate_idx: Number,
//   target_x: Number,
//   target_y: Number,
//   f_x: Number, 
//   f_y: Number,
//   distance: Number,
//   error_percentage: Number,
//   username: String,
// });

// const CalibrationData = mongoose.model('CalibrationData', calibrationDataSchema);
const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow credentials
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport setup
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  console.log("Inside serializeUser")
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user);
});

// Routes
app.post('/register', async (req, res) => {
  try {
    const { username} = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    console.log(password)
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
});

// Login route with passport authentication
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ message: 'Login successful', user: req.user });
});

// Logout route
app.post('/logout', (req, res) => {
  console.log(req.session)
  req.logout();
  res.status(200).json({ message: 'Logout successful' });
});

// Protected route (requires authentication)
app.get('/profile', isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user });
});

app.get('/calibrationData', async (req, res) => {
  const username = req.user.username
  console.log(username)
  try {
    // Find all documents in the collection where username is "waa@gmail.com"
    const collection = await connectDatabase();
    const result = await collection.find({ username: username }).toArray();
    console.log('Found documents:', result);
    res.json(result);
    
  } catch (err) {
    console.error('Error while finding documents:', err);
  }
});

function isAuthenticated(req, res, next) {
  console.log("User: " + req.user)
  console.log(req.session)
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Access denied. Please log in.' });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
