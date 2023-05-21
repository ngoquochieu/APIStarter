const Post = require('../models/Post');
const User = require('../models/User');
const index = async (req, res, next) => {
  const posts = await Post.find({});

  return res.status(200).json({ message: 'GET SUCCESSFUL ', data: posts });
};

const createPost = async (req, res, next) => {
  const { userID } = req.body;
  const user = await User.findById({ _id: userID });
  const { title, img } = req.body;
  const newPost = await new Post({
    title,
    img,
  });
  if (newPost) {
    const post = await newPost.save();
    user.post.push(post);
    await user.save();
    return res.status(201).json({ message: 'Create success!' });
  }
  return res.status(403).json({ error: { message: 'Failed create!' } });
};

module.exports = {
  index,
  createPost,
};
