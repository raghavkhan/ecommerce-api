const mongoose = require('mongoose');
const validator = require('validator');

const SchemaObject = {
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minLength: 6,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    //first approach
    // match: [
    //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //   'please provide valid email',
    // ],
    //second approach
    validate: {
      validator: validator.isEmail,
      message: 'please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
};
const UserSchema = new mongoose.Schema(SchemaObject);
const model = mongoose.model('User', UserSchema);
module.exports = model;
