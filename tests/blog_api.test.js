const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')


describe('blogs can be added and deleted', () => {
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


    const response = await helper.blogsInDb()

    const titles = response.map(r => r.title)

    expect(response.length).toBe(helper.blogs.length + 1)
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

    expect(response.body.length).toBe(helper.blogs.length + 1)

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


  // test('a blog can be deleted', async () => {
  //   const blogsAtStart = await helper.blogsInDb()
  //   const blogToDelete = blogsAtStart[1]

  //   await api
  //     .delete(`/api/blogs/${blogToDelete.id}`)
  //     .expect(204)

  //   const blogsAtEnd = await helper.blogsInDb()

  //   expect(blogsAtEnd.length).toBe(helper.blogs.length - 1)
  //   const titles = blogsAtEnd.map(b => b.title)

  //   expect(titles).not.toContain(blogToDelete.title)
  // })

})



describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Noora82',
      name: 'Noora Virolainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

})




afterAll(() => {
  mongoose.connection.close()
})