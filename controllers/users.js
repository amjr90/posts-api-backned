const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if (!password || password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters long' })
    }

    const newUser = new User({
      username,
      name,
      passwordHash: password // In a real application, hash the password before saving
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter
