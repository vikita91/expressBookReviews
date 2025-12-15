const { verifyToken } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
  try {
    if (!req.session || !req.session.authorization) {
      return res.status(403).json({ 
        success: false,
        message: 'User not logged in' 
      });
    }

    const token = req.session.authorization.accessToken;
    
    if (!token) {
      return res.status(403).json({ 
        success: false,
        message: 'Access token not found' 
      });
    }

    // Verify JWT token
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

module.exports = { authenticate };



