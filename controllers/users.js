const User = require('../models/user');

const createUser = (req, res) => {
  User.create(req.body)
  .then((data) => {
    console.log(data)
  }).catch((err) =>{
    console.log(`При создании пользователя произошла ошибка ${err.message}`)
  })
};

module.exports = {
  createUser
}