const router = require('express-promise-router')();
const passport = require('passport');
const multer = require('multer');

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
  .post(
    passport.authenticate('jwt', { session: false }),
    PostController.createPost
  );

module.exports = router;
