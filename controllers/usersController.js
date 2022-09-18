const { v4: uuid } = require('uuid')
const User = require('../models/User')
const { requiredFields } = require('../utils/validation')

// @desc    Get all users
// @route   GET /users
// @access  Public
const getAllUsers = (req, res) => {
  res.status(200).json(
    User.find().map(user => {
      const { password, ...rest } = user
      return rest
    })
  )
}

// @desc    Get a user
// @route   GET /users/:id
// @access  Public
const getUser = (req, res) => {
  // check for fields
  const { id } = req.params

  // check for existing user
  const user = User.findById(id)
  if (!user) return res.status(404).json({ message: 'user not found' })

  const { password, ...rest } = user
  res.status(200).json(rest)
}

// @desc    Create a user
// @route   POST /users
// @access  Public
const createNewUser = (req, res) => {
  // check for fields
  const { username, password } = req.body
  const message = requiredFields({ username, password })
  if (message) return res.status(400).json({ message })

  // check for existing user
  const user = User.findOne({ username })
  if (user) return res.status(409).json({ message: 'username already exists' })

  // creating user
  User.create({ username, password, id: uuid() })
  res.status(201).json({ message: 'user created' })
}

// @desc    Updates a user
// @route   PATCH /users
// @access  Private
const updateUser = (req, res) => {
  // check for fields
  const { username, password, id } = req.body
  const message = requiredFields({ username, password, id })
  if (message) return res.status(400).json({ message })

  // check if allowed
  const user = User.findById(id)
  if (user.id !== req.user.id)
    return res.status(403).json({ message: 'not authorized' })

  // updating user
  User.findByIdAndUpdate(id, { username, password })
  res.status(200).json({ message: 'user updated' })
}

// @desc    Deletes a user
// @route   DELETE /users
// @access  Private
const deleteUser = (req, res) => {
  // check for fields
  const { id } = req.body
  const message = requiredFields({ id })
  if (message) return res.status(400).json({ message })

  // check if allowed
  const user = User.findById(id)
  if (user.id !== req.user.id)
    return res.status(403).json({ message: 'not authorized' })

  // updating user
  User.findByIdAndDelete(id)
  res.status(200).json({ message: 'user deleted' })
}

module.exports = {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
}
