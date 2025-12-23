require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')

const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(express.json())
app.use(cors())

const usersRouter = require('./controllers/users')
const postsRouter = require('./controllers/posts')

postsRouter.get('/', (req, res) => {
  res.send('<h1>Welcome to the Posts API</h1>')
})

app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)

// Middleware de manejo de errores
app.use(errorHandler)
// 404 para rutas no encontradas
app.use(notFound)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = { app, server }
