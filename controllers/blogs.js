const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  const user = await User
  .findById("5cc7f67d7021bb1926821afe")
  blog.user = user.id

  if (!blog.likes) {
    blog.likes = 0
  }
  if (!blog.title || !blog.url) {
    return response.status(400).send({error: 'et voi lisätä blogia ilman otsikkoa tai osoitetta.'})
  }

  const result = await blog.save()
  user.blogs = user.blogs.concat(blog)
  await user.save()

  response.status(201).json(result)



})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    await Blog.findByIdAndRemove(request.body.id)
    response.status(204).end()
 
})

module.exports = blogsRouter