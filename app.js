const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const usersRouter = require('./routes/users');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mestodb')


app.use(bodyParser.json());

app.use('/users', usersRouter);

app.listen(3000, () =>{
  console.log("Cервер запущен!")
})
