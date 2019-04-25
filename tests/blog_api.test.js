const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')



beforeEach(async () => {
  await Blog.deleteMany({})

  let noteObject = new Blog(helper.blogs[0])
  await noteObject.save()

  noteObject = new Blog(helper.blogs[1])
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
  expect(response.body.length).toBe(helper.blogs.length)
})


test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "uusi",
    author: "noora",
    url: "jaajajaja",
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body.length).toBe(helper.blogs.length + 1)
  expect(titles).toContain("uusi")
})

test('blog without likes cant add', async () => {
  const newBlog = {
    title: "ilmanLikeja",
    author: "kalle",
    url: "jjeee",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)

  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.blogs.length +1 )

//  tässä pitäs löytää response-joukosta uusi lisätty blogi ja tallentaa se muuttujaklsi newOne

      // expect(newOne.likes).toBe(0)

})

test('blog without title or url cant add', async () => {
  const newBlog = {
    author: "without url",
    likes: "7"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

// test('a note can be deleted', async () => {
//   const response = await api.get('/api/blogs')
//   const blogsAtStart = response.body.map(b => b)

//   const noteToDelete = blogsAtStart[0]

//   await api
//     .delete(`/api/blogs/${noteToDelete.id}`)
//     .expect(204)

//     const response1 = await api.get('/api/blogs')
//     const notesAtEnd = response1.body.map(b => b)

//   expect(notesAtEnd.length).toBe(
//     blogs.length - 1
//   )

//   const contents = notesAtEnd.map(r => r.title)

//   expect(contents).not.toContain(noteToDelete.title)
// })


afterAll(() => {
  mongoose.connection.close()
})