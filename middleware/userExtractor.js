const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('authorization')
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }

  const token = authHeader.substring(7)
  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }

  if (!decodedToken.username || !decodedToken.id) {
    return res.status(401).json({ error: 'Token invalid' })
  }

  const { id: userId } = decodedToken
  req.userId = userId

  next()
}
