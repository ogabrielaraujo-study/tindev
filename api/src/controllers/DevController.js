const axios = require('axios')
const Dev = require('../models/Dev')

module.exports = {
  async index(req, res) {
    const { user } = req.headers

    const loggedDev = await Dev.findById(user)

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } }, // não listar o usuário atual
        { _id: { $nin: loggedDev.likes } }, // não listar usuários que já deu like
        { _id: { $nin: loggedDev.dislikes } }, // não listar usuários que já deu dislike
      ],
    })

    return res.json(users)
  },

  async store(req, res) {
    const { username: user } = req.body

    const userExists = await Dev.findOne({ user })

    if (userExists) {
      return res.json(userExists)
    }

    const response = await axios.get(`https://api.github.com/users/${user}`)

    const { name, bio, avatar_url: avatar } = response.data

    const dev = await Dev.create({
      name,
      user,
      bio,
      avatar,
    })

    return res.json(dev)
  },
}
