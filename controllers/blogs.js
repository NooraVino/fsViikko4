const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})


blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })


    if (!blog.likes) {
      blog.likes = 0
    }
    if (!blog.title || !blog.url) {
      return response.status(400).send({ error: 'et voi lisätä blogia ilman otsikkoa tai osoitetta.' })
    }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog.toJSON())

  } catch (exception) {
    next(exception)
  }

})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  console.log("idididid: ", id)
  try {
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  } catch (exeption) {
    response.status(400).send({ error: 'malformed id' })
  }

})

module.exports = blogsRouter