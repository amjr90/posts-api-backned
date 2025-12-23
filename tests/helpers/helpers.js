const supertest = require('supertest')
const { app } = require('../../index')
const api = supertest(app)
const ObjectId = require('mongoose').Types.ObjectId

const initialPosts = [
  {
    user: new ObjectId('64b7f8f5c2a1f2b4d5e6f7aa'),
    content: 'This is the content of the first post.'
  },
  {
    user: new ObjectId('64b7f8f5c2a1f2b4d5e6f7a9'),
    content: 'This is the content of the second post.'
  }
]

module.exports = {
  initialPosts, api
}
