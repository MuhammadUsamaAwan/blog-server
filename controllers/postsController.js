const { v4: uuid } = require('uuid')
const Post = require('../models/Post')
const { requiredFields } = require('../utils/validation')

// @desc    Get all posts
// @route   GET /posts
// @access  Public
const getAllPosts = (req, res) => {
  res.status(200).json(Post.find())
}

// @desc    Get a post
// @route   GET /posts/:id
// @access  Public
const getPost = (req, res) => {
  // check for fields
  const { id } = req.params

  // check for existing post
  const post = Post.findById(id)
  if (!post) return res.status(400).json({ message: 'post not found' })

  res.status(200).json(post)
}

// @desc    Create a post
// @route   POST /posts
// @access  Private
const createNewPost = (req, res) => {
  // check for fields
  const { title, body } = req.body
  const message = requiredFields({ title, body })
  if (message) return res.status(400).json({ message })

  // creating post
  Post.create({
    title,
    body,
    id: uuid(),
    user: {
      username: req.user.username,
      id: req.user.id,
    },
    credate: new Date(),
    updated: new Date(),
    likes: [],
    comments: [],
  })
  res.status(201).json({ message: 'post created' })
}

// @desc    Updates a post
// @route   PATCH /posts
// @access  Private
const updatePost = (req, res) => {
  // check for fields
  const { title, body, id } = req.body
  const message = requiredFields({ title, body, id })
  if (message) return res.status(400).json({ message })

  // check for existing post
  const post = Post.findById(id)
  if (!post) return res.status(404).json({ message: 'post not found' })

  // check if allowed
  if (post.user.id !== req.user.id)
    return res.status(403).json({ message: 'not authorized' })

  // updating post
  Post.findByIdAndUpdate(id, { title, body, updated: new Date() })
  res.status(201).json({ message: 'post updated' })
}

// @desc    Deletes a post
// @route   DELETE /posts
// @access  Private
const deletePost = (req, res) => {
  // check for fields
  const { id } = req.body
  const message = requiredFields({ id })
  if (message) return res.status(400).json({ message })

  // check for existing post
  const post = Post.findById(id)
  if (!post) return res.status(404).json({ message: 'post not found' })

  // check if allowed
  if (post.user.id !== req.user.id)
    return res.status(403).json({ message: 'not authorized' })

  // updating post
  Post.findByIdAndDelete(id)
  res.status(200).json({ message: 'post deleted' })
}

// @desc    Like a post
// @route   PUT /posts/like
// @access  Private
const likePost = (req, res) => {
  // check for fields
  const { id } = req.body
  const message = requiredFields({ id })
  if (message) return res.status(400).json({ message })

  // check for existing post
  const post = Post.findById(id)
  if (!post) return res.status(400).json({ message: 'post not found' })

  // check if allowed
  if (post.likes.includes(req.user.id)) {
    Post.findByIdAndUpdate(id, {
      likes: post.likes.filter(item => item !== req.user.id),
    })
    return res.status(200).json({ message: 'post unliked' })
  } else {
    Post.findByIdAndUpdate(id, { likes: [...post.likes, req.user.id] })
    return res.status(200).json({ message: 'post liked' })
  }
}

// @desc    Comment on post
// @route   PUT /posts/comment
// @access  Private
const commentPost = (req, res) => {
  // check for fields
  const { id, comment } = req.body
  const message = requiredFields({ id, comment })
  if (message) return res.status(400).json({ message })

  // check for existing post
  const post = Post.findById(id)
  if (!post) return res.status(400).json({ message: 'post not found' })

  Post.findByIdAndUpdate(id, {
    comments: [
      ...post.comments,
      {
        comment,
        id: uuid(),
        user: {
          username: req.user.username,
          id: req.user.id,
        },
        credate: new Date(),
      },
    ],
  })
  return res.status(200).json({ message: 'comment added' })
}

// @desc    Comment on post
// @route   PUT /posts/comment
// @access  Private
const deleteCommentPost = (req, res) => {
  // check for fields
  const { id, commentId } = req.body
  const message = requiredFields({ id, commentId })
  if (message) return res.status(400).json({ message })

  // check for existing post
  const post = Post.findById(id)
  if (!post) return res.status(404).json({ message: 'post not found' })

  // check for existing comment
  const comment = post.comments.find(comment => comment.id === commentId)
  if (!comment) return res.status(404).json({ message: 'comment not found' })

  // check if allowed
  if (comment.user.id !== req.user.id)
    return res.status(403).json({ message: 'not authorized' })

  Post.findByIdAndUpdate(id, {
    comments: post.comments.filter(item => item !== comment),
  })
  return res.status(200).json({ message: 'comment deleted' })
}

module.exports = {
  getAllPosts,
  getPost,
  createNewPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  deleteCommentPost,
}
