const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const posts = [{
  userId: 1,
  id: 1,
  content: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto'
},
{
  userId: 1,
  id: 2,
  content: 'est rerum tempore vitae sequi sint nihil reprehenderit dsdolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla'
},
{
  userId: 1,
  id: 3,
  content: 'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut'
}]

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Posts API</h1>')
})

app.get('/api/posts', (req, res) => {
  res.json(posts)
})

app.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10)
  const post = posts.find(p => p.id === postId)
  if (post) {
    res.json(post)
  } else {
    res.status(404).json({ message: 'Post not found' })
  }
})

app.delete('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10)
  const postIndex = posts.findIndex(p => p.id === postId)
  if (postIndex !== -1) {
    posts.splice(postIndex, 1.0)
    res.json({ message: 'Post deleted successfully' })
  } else {
    res.status(404).json({ message: 'Post not found' })
  }
})

app.post('/api/posts', express.json(), (req, res) => {
  const newPost = {
    userId: req.body.userId,
    id: Math.random().toString(36).substr(2, 9),
    content: req.body.content
  }
  posts.push(newPost)
  res.status(201).json(newPost)
})

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
