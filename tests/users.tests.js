const mongoose = require('mongoose')
const { server } = require('../index')
const { api } = require('./helpers/helpers')
const User = require('../models/User')

beforeEach(async () => {
  await User.deleteMany({})
})

test('a valid user can be added', async () => {
  const newUser = {
    username: 'newuser',
    name: 'New User',
    password: 'securepassword'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(1)
  const usernames = usersAtEnd.map(u => u.username)
  expect(usernames).toContain('newuser')
})

test('user with existing username is not added', async () => {
  const newUser = {
    username: 'existinguser',
    name: 'Existing User',
    password: 'anotherpassword'
  }

  // Add the user for the first time
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  // Try to add the same user again
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(result.body.error).toContain('`username` to be unique')

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(1)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
