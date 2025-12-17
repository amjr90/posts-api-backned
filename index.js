require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const Post = require('./models/Post')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Posts API</h1>')
})

// Callback con promesas (versión anterior)
// app.get('/api/posts', (req, res, next) => {
//   Post.find({}).then(posts => {
//     res.json(posts).end()
//   }).catch(err => {
//     next(err)
//   })
// })

app.get('/api/posts', async (req, res, next) => {
  try {
    const posts = await Post.find({})
    res.json(posts)
  } catch (err) {
    next(err)
  }
})

app.get('/api/posts/:id', async (req, res, next) => {
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

app.delete('/api/posts/:id', async (req, res, next) => {
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

app.post('/api/posts', async (req, res, next) => {
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

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack)

  switch (err.name) {
    case 'CastError':
      res.status(400).json({ error: 'Malformatted id', errorMsg: err.message })
      break
    case 'ValidationError':
      res.status(400).json({ error: 'Validation error', errorMsg: err.message })
      break
    default:
      res.status(500).json({ error: 'Something went wrong!', errorMsg: err.message })
      break
  }
})

// 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
