const User = require('../models/User');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  // const users = await User.find({ role: 'user' }, { password: 0 }); //another way
  res.status(StatusCodes.OK).json({ count: users.length, users });
};

// const getSingleUser = async (req, res) => {
//   console.log(req.user);
//   // req.params.id = req.user.userId;
//   const users = await User.findOne({ _id: req.params.id }).select('-password');
//   // const { id: userId } = req.params;
//   // const users = await User.findOne({ _id: req.user.userId }).select(
//   //   '-password'
//   // );
//   if (!users) {
//     throw new CustomError.NotFoundError(`No user with this id : ${userId}`);
//   }
//   res.status(StatusCodes.OK).json({ users });
// };

const getSingleUser = async (req, res) => {
  const users = await User.findOne({ _id: req.params.id }).select('-password');

  if (!users) {
    throw new CustomError.NotFoundError(
      `No user with this id :${req.params.id}`
    );
  }
  checkPermissions(req.user, users._id);
  res.status(StatusCodes.OK).json({ users });
};
const showCurrentUser = async (req, res) => {
  // It can also be done like this-
  // const users = await User.findOne({ _id: req.user.userId }).select(
  //   '-password'
  // );
  // if (!users) {
  //   throw new CustomError.NotFoundError(`No user with this id : ${userId}`);
  // }
  // res.status(StatusCodes.OK).json({ users });

  // but better way-
  res.status(StatusCodes.OK).json({ users: req.user });
};
const updateUser = async (req, res) => {
  const { name: userName, userId, role } = req.user;
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError(
      `please provide name and email for updation`
    );
  }
  // const users = await User.findOneAndUpdate(
  //   { _id: userId },
  //   { email, name },
  //   { new: true, runValidators: true }
  // );
  const users = await User.findOne({ _id: userId });
  users.email = email;
  users.name = name;
  await users.save();

  const tokenUser = createTokenUser({ users });
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ users: tokenUser });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('please provide both values');
  }
  // console.log(req.user);
  const users = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await users.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Old Password does not match');
  }
  users.password = newPassword;
  await users.save();
  // res.status(StatusCodes.OK).json({ msg: 'Success! Password updated.' });
  res.status(StatusCodes.OK).json({ users });
  // res.send(`updateUserPassword`);
  // $2a$10$URoAZw9ELIjxEHCepdP4yOVeeRZVJ0RWHeqgHI/bXGFBt0Hr/148i
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

// const updateUser = async (req, res) => {
//   console.log(req.user);
//   const { name: userName, userId, role } = req.user;
//   const { name, email } = req.body;
//   if (!name || !email) {
//     throw new CustomError.BadRequestError(
//       `please provide name and email for updation`
//     );
//   }
//   const users = await User.findOneAndUpdate(
//     { _id: userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   if (!users) {
//     throw new CustomError.NotFoundError('no such user');
//   }
//   const tokenUser = createTokenUser({ users });
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ users: tokenUser });
// };
