const mongoose = require('mongoose')
const { server } = require('../index')
const { api } = require('./helpers/helpers')
const User = require('../models/User')

beforeEach(async () => {
  await User.deleteMany({})
})

test('users returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
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

  expect(result.body.error).toContain('Username must be unique')

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(1)
})

test('user with short password is not added', async () => {
  const newUser = {
    username: 'shortpassuser',
    name: 'Short Pass User',
    password: 'pw'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(result.body.error).toContain('Password must be at least 3 characters long')

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(0)
})

test('user with short username is not added', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short Username User',
    password: 'validpassword'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(result.body.error).toContain('Username must be at least 3 characters long')

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(0)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
