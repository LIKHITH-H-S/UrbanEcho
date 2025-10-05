const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    console.log('🔍 Auth Header received:', authHeader);

    if (!authHeader) {
      console.log('❌ No Authorization header provided');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ Authorization header does not start with Bearer');
      return res.status(401).json({ error: 'Invalid token format. Must start with Bearer' });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'undefined' || token === 'null') {
      console.log('❌ Token is missing, undefined, or null');
      return res.status(401).json({ error: 'Access denied. Invalid token.' });
    }

    console.log('🔍 Verifying token:', token.substring(0, 20) + '...');
    console.log('🔍 JWT_SECRET present:', !!process.env.JWT_SECRET);

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not set!');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log('✅ Token verified successfully');
    console.log('✅ User ID:', decoded.userId);
    console.log('✅ User type:', decoded.userType || 'not specified');

    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    console.error('❌ Error name:', err.name);
    console.error('❌ Error stack:', err.stack);

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token format' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    } else if (err.name === 'NotBeforeError') {
      return res.status(401).json({ error: 'Token not active yet' });
    } else {
      return res.status(401).json({ error: 'Token verification failed: ' + err.message });
    }
  }
};
module.exports = verifyToken;
