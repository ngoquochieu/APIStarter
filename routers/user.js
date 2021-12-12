const express = require('express');
// const router = express.Router();
const router = require('express-promise-router')();

const {validateBody ,validateParam, schemas} = require('../helpers/routerHelpers');

const UserController = require('../controllers/user');

router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema), UserController.newUser)

router.route('/:userID')
    .get(validateParam(schemas.idSchema, 'userID'), UserController.getUser)
    .put(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), UserController.replaceUser)
    .patch(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userOption), UserController.updateUser)

router.route('/:userID/decks')
    .get(validateParam(schemas.idSchema, 'userID'), UserController.getUserDecks)
    .post(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.deckSchema), UserController.newUserDeck)

    module.exports = router;