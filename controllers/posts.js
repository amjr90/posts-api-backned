const postsRouter = require('express').Router()
const Post = require('../models/Post.js')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

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
    const posts = await Post.find({}).populate('user', { username: 1, name: 1 })
    res.json(posts)
  } catch (err) {
    next(err)
  }
})

postsRouter.get('/:id', userExtractor, async (req, res, next) => {
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

postsRouter.delete('/:id', userExtractor, async (req, res, next) => {
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

postsRouter.post('/', userExtractor, async (req, res, next) => {
  try {
    const user = req.userId
    const { content } = req.body
    if (!user || !content) {
      return res.status(400).json({ error: 'user and content are required' })
    }

    const userFinded = await User.findById(user)
    if (!userFinded) {
      return res.status(400).json({ error: 'Invalid userId' })
    }

    const newPost = new Post({
      user,
      content
    })
    const savedPost = await newPost.save()
    userFinded.posts = userFinded.posts.concat(savedPost._id)
    await userFinded.save()
    res.status(201).json(newPost)
  } catch (err) {
    console.error('Error creating post:', err)
    next(err)
  }
})

postsRouter.put('/:id', userExtractor, async (req, res, next) => {
  try {
    const { content } = req.body

    // Validación simple
    if (!content) {
      console.log('Missing content in request body')
      return res.status(400).json({ error: 'content is required' })
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { content },
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
