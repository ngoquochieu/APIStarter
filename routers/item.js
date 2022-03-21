const express = require('express');
// const router = express.Router();
const router = require('express-promise-router')();

const {validateBody, validateParam, schemas, } = require('../helpers/routerHelpers');

const ItemController = require('../controllers/item');

const passport = require('passport');
const passportConfig = require('../middlewares/passport');

router.route('/')
  .get(ItemController.getAll)
  .post(validateBody(schemas.newItemSchema), ItemController.newItem)

router.route('/:itemID').get(validateParam(schemas.idSchema, 'itemID'), ItemController.getItemID);

module.exports = router;
