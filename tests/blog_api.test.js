const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const blogs = [
{
  title: "kokeilu",
  author: "ksksks",
  url: "hhfhd",
  likes: 2,
  id: "5c67dd9f13152d61377d2782"
  },
  {
  title: "toinen",
  author: "nälkä",
  url: "hhfhjddjdj",
  likes: 100,
  id: "5c67de4713152d61377d2783"
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let noteObject = new Blog(blogs[0])
  await noteObject.save()

  noteObject = new Blog(blogs[1])
  await noteObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(blogs.length)
})




afterAll(() => {
  mongoose.connection.close()
})