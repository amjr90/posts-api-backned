module.exports = (err, req, res, next) => {
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
}
