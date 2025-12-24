const User = require ('../models/User');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');

// REGISTER
exports.registerUser = async (req, res) => {
  const {name, email, password} = req.body;
  console.log (req.body);

  try {
    const userExists = await User.findOne ({email});
    if (userExists)
      return res.status (400).json ({message: 'User already exists'});

    const salt = await bcrypt.genSalt (10);
    const hashedPassword = await bcrypt.hash (password, salt);

    const user = await User.create ({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign ({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status (201).json ({token});
  } catch (error) {
    console.error (error); // 🔥 THIS LINE
    res.status (500).json ({
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne ({email});
    if (!user) return res.status (400).json ({message: 'Invalid credentials'});

    const isMatch = await bcrypt.compare (password, user.password);
    if (!isMatch)
      return res.status (400).json ({message: 'Invalid credentials'});

    const token = jwt.sign ({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json ({token});
  } catch (error) {
    res.status (500).json ({message: 'Login failed'});
  }
};
