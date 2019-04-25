const notesRouter = require('express').Router()
const Blog = require('../models/blog')

notesRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

notesRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.likes) {
    blog.likes = 0
  }
  if (!blog.title || !blog.url) {
    return response.status(400).send({error: 'et voi lisätä blogia ilman otsikkoa tai osoitetta.'})
  }

  const newBlog = await blog.save()
  response.json(newBlog.toJSON())

})

module.exports = notesRouter