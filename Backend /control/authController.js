const { User, Api } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'tradeSecretKey';

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ state: false, message: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ state: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '24h' });
    await User.update({ token }, { where: { id: user.id } });
    
    return res.status(200).json({ 
      state: true, 
      token,
      type: user.type
    });
  } catch (error) {
    return res.status(500).json({
      state: false,
      message: 'An error occurred during authentication.'
    });
  }
};

exports.getUserAPIs = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            console.error('No user found in request');
            return res.status(401).json({
                message: 'User not authenticated'
            });
        }
        
        console.log('Attempting to fetch APIs for user:', {
            id: user.id,
            email: user.email,
            companyEmail: user.companyEmail
        });
        
        const apis = await Api.findAll();
        console.log('Found APIs:', apis);

        return res.status(200).json({ apis });
    } catch (error) {
        console.error('Error in getUserAPIs:', {
            name: error.name,
            message: error.message,
            sql: error.sql,
            sqlMessage: error.parent?.sqlMessage
        });
        return res.status(500).json({ 
            message: 'An error occurred while fetching APIs.'
        });
    }
};

Api.migrate = async () => {
  // const count = await User.count();

  // if (!count) {
  await Api.destroy({ truncate: true });

  await Api.create({
    id: 1,
    api: 'wsaVL02X4vyjgU1DMatg'
  });
  await Api.create({
    id: 2,
    api: 'wsJ40TGsE4xf5ABWPy7Q'
  });
  await Api.create({
    id: 3,
    api: 'wsp44Clhx5d1HwD_WBCA'
  });
  // }
};

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, secretKey);
        console.log('Decoded token:', decoded);

        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};