const mongoose = require('mongoose');

const SchemaObject = {
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide review rating'],
  },
  title: {
    type: String,
    trim: true,
    required: [true, 'Please provide review title'],
    maxlength: 100,
  },
  comment: {
    type: String,
    required: [true, 'Please provide review text'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
};
const ReviewSchema = new mongoose.Schema(SchemaObject, { timestamps: true });

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
const model = mongoose.model('Review', ReviewSchema);

module.exports = model;
