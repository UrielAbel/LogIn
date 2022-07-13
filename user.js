const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('database (hay que poner una jeje)',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  password: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('userData', User, 'userData');