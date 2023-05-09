const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
  },
  img: {
    type: String,
  },
  like: {
    type: String,
  },
  share: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
