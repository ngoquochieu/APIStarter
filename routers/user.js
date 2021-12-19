const express = require('express');
// const router = express.Router();
const router = require('express-promise-router')();

const {validateBody, validateParam, schemas, } = require('../helpers/routerHelpers');

const UserController = require('../controllers/user');

const passport = require('passport');
const passportConfig = require('../middlewares/passport');

router.route('/')
  .get(UserController.index)
  .post(validateBody(schemas.userSchema) ,UserController.newUser);

router.route('/auth/google').post( passport.authenticate('google-plus-token', {session: false}), UserController.authGoogle)  

router.route('/auth/facebook').post( passport.authenticate('facebook-token', {session: false}), UserController.authFacebook)  

router.route('/signup').post(validateBody(schemas.authSignUpSchema), UserController.signUp);

router.route('/signin').post(validateBody(schemas.authSignInSchema), passport.authenticate('local', ({session: false})), UserController.signIn);

router.route('/secret').get(passport.authenticate('jwt', {session: false}), UserController.secrect); //Test

router.route('/:userID')
  .get(validateParam(schemas.idSchema, 'userID'), UserController.getUser)
  // .put(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), UserController.replaceUser)
  .patch(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userOption), UserController.updateUser)
  .delete(validateParam(schemas.idSchema, 'userID'), UserController.deleteUser)

router.route('/:userID/decks')
  .get(validateParam(schemas.idSchema, 'userID'), UserController.getUserDecks)
  .post(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.deckSchema), UserController.newUserDeck);

module.exports = router;
