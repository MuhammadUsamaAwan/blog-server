const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protected = (req, res, next) => {
  const authorization = req.headers.authorization || req.headers.Authorization
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = User.findOne({ username: decoded.username })
      next()
    } catch (err) {
      return res.status(403).json({ message: 'not authorized' })
    }
  } else return res.status(401).json({ message: 'not authorized, no token' })
}

module.exports = { protected }
