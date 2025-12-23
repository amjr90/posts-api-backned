const mongoose = require('mongoose')
const { server } = require('../index')
const Post = require('../models/Post')
const { initialPosts, api } = require('./helpers/helpers')

beforeEach(async () => {
  await Post.deleteMany({})
  for (const post of initialPosts) {
    const postObject = new Post(post)
    await postObject.save()
  }
})

test('notes returen as json', async () => {
  await api
    .get('/api/posts')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two posts', async () => {
  const response = await api.get('/api/posts')
  expect(response.body).toHaveLength(initialPosts.length)
})

test('a specific post is within the returned posts', async () => {
  const response = await api.get('/api/posts')
  const contents = response.body.map(r => r.content)
  expect(contents).toContain('This is the content of the first post.')
})

test('a valid post can be added', async () => {
  const newPost = {
    userId: 2,
    content: 'This is a newly added post.'
  }

  await api
    .post('/api/posts')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/posts')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialPosts.length + 1)
  expect(contents).toContain('This is a newly added post.')
})

test('post without content is not added', async () => {
  const newPost = {
    userId: 3
  }

  await api
    .post('/api/posts')
    .send(newPost)
    .expect(400)

  const response = await api.get('/api/posts')

  expect(response.body).toHaveLength(initialPosts.length)
})

test('a specific post can be viewed', async () => {
  const postsAtStart = await api.get('/api/posts')
  const postToView = postsAtStart.body[0]

  const resultPost = await api
    .get(`/api/posts/${postToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultPost.body).toEqual(postToView)
})

test('a post can be deleted', async () => {
  const postsAtStart = await api.get('/api/posts')
  const postToDelete = postsAtStart.body[0]

  await api
    .delete(`/api/posts/${postToDelete.id}`)
    .expect(204)

  const postsAtEnd = await api.get('/api/posts')

  expect(postsAtEnd.body).toHaveLength(
    initialPosts.length - 1
  )

  const contents = postsAtEnd.body.map(r => r.content)

  expect(contents).not.toContain(postToDelete.content)
})

test('a post can be updated', async () => {
  const postsAtStart = await api.get('/api/posts')
  const postToUpdate = postsAtStart.body[0]

  const updatedPostData = {
    userId: postToUpdate.userId,
    content: 'This content has been updated.'
  }

  const updatedPost = await api
    .put(`/api/posts/${postToUpdate.id}`)
    .send(updatedPostData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(updatedPost.body.content).toBe(updatedPostData.content)

  const postsAtEnd = await api.get('/api/posts')
  const contents = postsAtEnd.body.map(r => r.content)

  expect(contents).toContain(updatedPostData.content)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
