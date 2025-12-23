const supertest = require('supertest')
const { app } = require('../../index')
const api = supertest(app)

const initialPosts = [
  {
    userId: 1,
    content: 'This is the content of the first post.'
  },
  {
    userId: 1,
    content: 'This is the content of the second post.'
  }
]

module.exports = {
  initialPosts, api
}
