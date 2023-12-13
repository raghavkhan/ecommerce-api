const mongoose = require('mongoose');

const SchemaObject = {
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide product name'],
    maxlength: [100, 'name cannot be more than 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [1000, 'description cannot be more than 100 characters'],
  },
  image: { type: String, default: '/uploads/example.jpeg' },
  category: {
    type: String,
    required: [true, 'Please provide Category'],
    enum: ['office', 'kitchen', 'bedroom'],
  },
  company: {
    type: String,
    required: [true, 'Please provide company'],
    enum: {
      values: ['ikea', 'liddy', 'marcos'],
      message: '{VALUE} is not supported with {PATH}',
    },
  },
  colors: { type: [String], default: ['#222'], required: true },
  featured: { type: Boolean, default: false },
  freeShipping: { type: Boolean, default: false },
  inventory: { type: Number, required: true, default: 15 },
  averageRating: { type: Number, default: 0 },
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
};
const ProductSchema = new mongoose.Schema(SchemaObject, { timestamps: true });

const model = mongoose.model('Product', ProductSchema);

module.exports = model;
