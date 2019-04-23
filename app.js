
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const notesRouter = require('./controllers/blogs')
const config = require('./utils/config')
const mongoose = require('mongoose')


console.log('commecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

  
  app.use(cors())
  app.use(bodyParser.json())
  app.use('/api/blogs', notesRouter)
  
  

  module.exports = app