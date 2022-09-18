let users = require('../data/usersData.json')
const fsPromises = require('fs').promises
const path = require('path')

const find = body => {
  if (!body) return users
  const length = Object.keys(body).length
  const keys = Object.keys(body)
  const values = Object.values(body)
  let result
  for (let i = 0; i < length; i++)
    result = users.filter(user => user[keys[i]] === values[i])
  return result
}

const findById = id => users.find(user => user.id === id)

const findByIdAndDelete = id => saveFile(users.filter(user => user.id !== id))

const findByIdAndUpdate = (id, update) => {
  const foundUser = findById(id)
  const updatedUsers = users.map(user =>
    user === foundUser ? { ...user, ...update } : user
  )
  saveFile(updatedUsers)
}

const findOne = body => {
  if (!body) return users.find(user => user)
  const length = Object.keys(body).length
  const keys = Object.keys(body)
  const values = Object.values(body)
  let result
  for (let i = 0; i < length; i++)
    result = users.find(user => user[keys[i]] === values[i])
  return result
}

const create = async user => saveFile([...users, user])

const saveFile = async users => {
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'data', 'usersData.json'),
    JSON.stringify(users)
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
