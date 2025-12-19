const { User } = require('../models');
const { createToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const userExists = await User.exists(username);
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = await User.create(username, password);

    res.status(201).json({
      success: true,
      message: 'User successfully registered. Now you can login',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Validate password
    const isValidPassword = await User.validatePassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Create JWT token
    const accessToken = await createToken(username);

    // Store token in session
    req.session.authorization = {
      accessToken,
      username,
    };

    res.status(200).json({
      success: true,
      message: 'User successfully logged in',
      data: {
        accessToken,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};



