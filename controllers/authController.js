const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { requiredFields } = require('../utils/validation')

// @desc    Login a user
// @route   POST /login
// @access  Public
const login = (req, res) => {
  // check for fields
  const { username, password } = req.body
  const message = requiredFields({ username, password })
  if (message) return res.status(400).json({ message })

  // check for existing user
  const user = User.findOne({ username, password })
  if (!user) return res.status(400).json({ message: 'invalid credentials' })

  const token = jwt.sign({ username, id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

  res.status(200).json(token)
}

module.exports = { login }
