const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  introduce: {
    type: String,
  },
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  priceStart: {
    type: String,
  },
  priceEnd: {
    type: String,
  },
  open: {
    type: String,
  },
  close: {
    type: String,
  },
  ratting: {
    type: String,
  },
  location: {
    lat: {
      type: String,
    },
    lon: {
      type: String,
    },
  },
  denomina: {
    type: String,
    // enum: ['VND', 'USA'],
  },
  type: {
    type: String,
    // enum: ['coffee', 'restaurant'],
  },
  img: {
    type: String,
  },
  banner: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Owner = mongoose.model('Owner', OwnerSchema);
module.exports = Owner;
