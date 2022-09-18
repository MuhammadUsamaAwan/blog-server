let posts = require('../data/postsData.json')
const fsPromises = require('fs').promises
const path = require('path')

const find = body => {
  if (!body) return posts
  const length = Object.keys(body).length
  const keys = Object.keys(body)
  const values = Object.values(body)
  let result
  for (let i = 0; i < length; i++)
    result = posts.filter(post => post[keys[i]] === values[i])
  return result
}

const findById = id => posts.find(post => post.id === id)

const findByIdAndDelete = id => saveFile(posts.filter(post => post.id !== id))

const findByIdAndUpdate = (id, update) => {
  const foundPost = findById(id)
  const updatedPosts = posts.map(post =>
    post === foundPost ? { ...post, ...update } : post
  )
  saveFile(updatedPosts)
}

const findOne = body => {
  if (!body) return posts.find(post => post)
  const length = Object.keys(body).length
  const keys = Object.keys(body)
  const values = Object.values(body)
  let result
  for (let i = 0; i < length; i++)
    result = posts.find(post => post[keys[i]] === values[i])
  return result
}

const create = async post => saveFile([...posts, post])

const saveFile = async posts => {
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'data', 'postsData.json'),
    JSON.stringify(posts)
  )
}

module.exports = {
  find,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findOne,
  create,
}
