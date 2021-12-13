const router = require('express-promise-router')();

const { model } = require('mongoose');
const DeckController = require('../controllers/deck');

const {
  validateBody,
  schemas,
  name,
  validateParam,
} = require('../helpers/routerHelpers');

router
  .route('/')
  .get(DeckController.index)
  .post(validateBody(schemas.newDeckSchema), DeckController.newDeck);

router
  .route('/:deckID')
  .get(validateParam(schemas.idSchema, 'deckID'), DeckController.getDeck)
  .put(
    validateParam(schemas.idSchema, 'deckID'),
    validateBody(schemas.newDeckSchema),
    DeckController.replaceDeck
  )
  .patch(
    validateParam(schemas.idSchema, 'deckID'),
    validateBody(schemas.optionDeck),
    DeckController.updateDeck
  )
  .delete(validateParam(schemas.idSchema, 'deckID'), DeckController.deleteDeck);

module.exports = router;
