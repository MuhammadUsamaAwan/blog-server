const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController')
const { protected } = require('../middleware/verifyToken')

router
  .route('/')
  .get(getAllUsers)
  .post(createNewUser)
  .patch(protected, updateUser)
  .delete(protected, deleteUser)

router.get('/:id', getUser)

module.exports = router
