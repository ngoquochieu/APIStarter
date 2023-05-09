const Post = require('../models/Post');

const index = async (req, res, next) => {
  const posts = await Post.find({});

  return res.status(200).json({ message: 'GET SUCCESSFUL ', data: posts });
};

const createPost = async (req, res, next) => {
  const { title, img, like, share } = req.body;
  const newPost = await new Post({
    title,
    img,
    like,
    share,
  });
  if (newPost) {
    await newPost.save();
    return res.status(201).json({ message: 'Create success!' });
  }
  return res.status(403).json({ error: { message: 'Failed create!' } });
};

module.exports = {
  index,
  createPost,
};
