const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });



// Models
const User = require('./models/User');

const SearchHistory = require('./models/SearchHistory');


// Express App Setup
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    req.user = decoded;
    next();
  });
};
// Routes
// Registration Route

const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const backupCodes = generateBackupCodes();
    const hshedBackupCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 10))
    );

    const user = new User({ email, password: hashedPassword,  backupCodes: hshedBackupCodes,});
    await user.save();


    res.status(201).json({ message: 'User registered successfully', backupCodes : backupCodes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/forgotPassword', async (req, res) => {
  const {email, password} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email }, {password: hashedPassword}, {new : true});
    res.status(201).json({message : 'User password updated successfully'});
  }
  catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
})


app.post('/api/validateBackupCode', async (req, res)=> {
  const {email, code} = req.body;
  const user = await User.findOne({ email });
  if (!user) {
      return res.status(400).json({ message: 'User not found' });
  }
  const matchedIndex = await Promise
      .all(user.backupCodes.map((hashedCode, index) => bcrypt.compare(code, hashedCode).then(isMatch => isMatch ? index : -1)))
      .then(results => results.find(index => index !== -1));
  
  if (matchedIndex === undefined) {
    return res.status(401).json({ message: 'Invalid backup code' });
  }
  user.backupCodes.splice(matchedIndex, 1);
  await user.save();
  res.json({ message: 'Backup code validated successfully' });
})

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, 'secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//search_history route
app.post('/api/search-history', authenticate, async (req, res) => {
  const { searchUrl, searchResponse } = req.body;
  const userEmail = req.user.email;

  try {
    const searchRecord = new SearchHistory({
      userEmail,
      searchUrl,
      searchResponse
    });
    await searchRecord.save();
    res.status(201).json({ message: 'Search history saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving search history' });
  }
});

app.get('/api/search-history', authenticate, async (req, res) => {
  const userEmail = req.user.email;
  try {
    const history = await SearchHistory.find({ userEmail }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching search history' });
  }
});


// Protected Route Example
app.get('/api/home', authenticate, (req, res) => {
  res.status(200).json({ message: 'Welcome to the home page!', user: req.user });
});

app.get('/api/user-profile', authenticate, (req, res) => {
  const userEmail = req.user.email;
  res.json({ email: userEmail });
});

// Start the Server
const PORT = 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
