const router = require('express-promise-router')();
const multer = require('multer');

const { model } = require('mongoose');
const PostController = require('../controllers/post');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// });

const upload = multer();
router
  .route('/')
  .get(PostController.index)
  // .post(upload.none(), PostController.createPost)
  .post(PostController.createPost);

module.exports = router;
