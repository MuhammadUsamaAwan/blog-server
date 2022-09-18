const express = require('express')
const router = express.Router()
const {
  getAllPosts,
  getPost,
  createNewPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  deleteCommentPost,
} = require('../controllers/postsController')
const { protected } = require('../middleware/verifyToken')

router
  .route('/')
  .get(getAllPosts)
  .post(protected, createNewPost)
  .patch(protected, updatePost)
  .delete(protected, deletePost)

router.get('/:id', getPost)
router.put('/like', protected, likePost)
router
  .route('/comment')
  .put(protected, commentPost)
  .delete(protected, deleteCommentPost)

module.exports = router
