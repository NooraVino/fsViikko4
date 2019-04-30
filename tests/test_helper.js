const Blog = require('../models/blog')
const User = require('../models/user')

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

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

  module.exports = {
    blogs, blogsInDb, usersInDb
  } 