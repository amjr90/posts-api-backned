const supertest = require('supertest')
const { app } = require('../../index')
const api = supertest(app)
const ObjectId = require('mongoose').Types.ObjectId

const initialPosts = [
  {
    userId: new ObjectId('64b7f8f5c2a1f2b4d5e6f7a8'),
    content: 'This is the content of the first post.'
  },
  {
    userId: new ObjectId('64b7f8f5c2a1f2b4d5e6f7a9'),
    content: 'This is the content of the second post.'
  }
]

module.exports = {
  initialPosts, api
}
