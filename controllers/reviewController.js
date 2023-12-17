const Review = require('../models/Review');
const Product = require('../models/Product');

const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require('../utils');

const createReview = async (req, res) => {
  // console.log(req.body);
  // const requestBody = req.body;
  // const reviews = await Review.create({ requestBody });
  // console.log(reviews);
  // res.json({ requestBody });

  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "You've already submitted a review for this product"
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });

  // res.send(`review created`);
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const reviews = await Review.findOne({ _id: reviewId })
    .populate({ path: 'product', select: 'name company price' })
    .populate({ path: 'user', select: 'name' });
  if (!reviews) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ reviews });
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const reviews = await Review.findOne({ _id: reviewId });
  if (!reviews) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
  }
  checkPermissions(req.user, reviews.user);
  reviews.rating = rating;
  reviews.title = title;
  reviews.comment = comment;

  await reviews.save();
  res.status(StatusCodes.OK).json({ reviews });
};
const deleteReview = async (req, res) => {
  // console.log(req.user, 'why i am undefined!');
  const { id: reviewId } = req.params;
  const reviews = await Review.findOne({ _id: reviewId });
  if (!reviews) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }
  checkPermissions(req.user, reviews.user);
  await reviews.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! review removed' });
};
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
