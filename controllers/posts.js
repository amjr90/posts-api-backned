const postsRouter = require('express').Router()
const Post = require('../models/Post')

// Callback con promesas (versión anterior)
// app.get('/api/posts', (req, res, next) => {
//   Post.find({}).then(posts => {
//     res.json(posts).end()
//   }).catch(err => {
//     next(err)
//   })
// })

postsRouter.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find({})
    res.json(posts)
  } catch (err) {
    next(err)
  }
})

postsRouter.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (post) {
      res.json(post)
    } else {
      res.status(404).json({ message: 'Post not found' })
    }
  } catch (err) {
    next(err)
  }
})

postsRouter.delete('/:id', async (req, res, next) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id })
    if (result.deletedCount > 0) {
      res.status(204).end()
    } else {
      res.status(404).json({ message: 'Post not found' })
    }
  } catch (err) {
    next(err)
  }
})

postsRouter.post('/', async (req, res, next) => {
  try {
    const { userId, content } = req.body

    // Validación simple
    if (!userId || !content) {
      return res.status(400).json({ error: 'userId and content are required' })
    }

    const newPost = await Post.create({ userId, content })
    res.status(201).json(newPost)
  } catch (err) {
    next(err)
  }
})

postsRouter.put('/:id', async (req, res, next) => {
  try {
    const { userId, content } = req.body

    // Validación simple
    if (!userId || !content) {
      return res.status(400).json({ error: 'userId and content are required' })
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { userId, content },
      { new: true, runValidators: true, context: 'query' }
    )

    if (updatedPost) {
      res.json(updatedPost)
    } else {
      res.status(404).json({ message: 'Post not found' })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = postsRouter
