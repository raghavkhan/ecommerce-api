const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

// const { BadRequestError, UnauthenticatedError } = CustomError;
const {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
} = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email Already Exists');
  }

  //first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const users = await User.create({ name, email, password, role });
  const tokenUser = createTokenUser({ users });
  // const tokenUser = { name: users.name, userId: users._id, role: users.role };

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ users: tokenUser });
};
const login = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const users = await User.findOne({ email });
  // console.log(users);
  if (!users) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await users.comparePassword(password);
  // console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Incorrect password');
  }
  // const tokenUser = { name: users.name, userId: users._id, role: users.role };
  const tokenUser = createTokenUser({ users });
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ users: tokenUser });
};
const logout = async (req, res) => {
  // console.log(req.signedCookies.token);
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

module.exports = { register, login, logout };

// const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {
//   expiresIn: process.env.JWT_LIFETIME,
// });

// const register = async (req, res) => {
//   const userPromise = User.create(req.body);
//   userPromise
//     .then((users) => {
//       res.json({ users });
//     })
//     .catch((errorr) => res.json({ errorr }));
// };
