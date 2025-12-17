const mongoose = require('mongoose')

const connectionString = process.env.MONGODB_URI

mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err)
  })

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err)
  mongoose.connection.disconnect()
    .then(() => {
      console.log('Disconnected from MongoDB due to uncaught exception')
      process.exit(1)
    })
    .catch(disconnectErr => {
      console.error('Error disconnecting from MongoDB:', disconnectErr)
      process.exit(1)
    })
})
