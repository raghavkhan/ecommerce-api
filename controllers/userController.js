const CustomError = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' });
  // .select('-password');
  // const users = await User.find({ role: 'user' }, { password: 0 }); //another way
  res.status(StatusCodes.OK).json({ count: users.length, users });
};
const getSingleUser = async (req, res) => {
  console.log(req.user);

  // req.params.id = req.user.userId;
  // const users = await User.findOne({ _id: id }).select('-password');
  // const { id: userId } = req.params;
  const users = await User.findOne({ _id: req.user.userId }).select(
    '-password'
  );
  if (!users) {
    throw new CustomError.NotFoundError(`No user with this id : ${userId}`);
  }
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
  res.send(`updateUser`);
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('please provide both values');
  }
  console.log(req.user);
  const users = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await users.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Old Password does not match');
  }
  users.password = newPassword;
  await users.save();
  // res.status(StatusCodes.OK).json({ msg: 'Success! Password updated.' });
  res.json({ users });
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
