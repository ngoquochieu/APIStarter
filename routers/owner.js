const router = require('express-promise-router')();
const passport = require('passport');
const {
  validateBody,
  validateParam,
  schemas,
} = require('../helpers/routerHelpers');
const OwnerController = require('../controllers/owner');

router.route('/').get(OwnerController.index).post(OwnerController.createOwner);

router
  .route('/:id')
  .patch(validateParam(schemas.idSchema, 'id'), OwnerController.editOwner)
  .get(validateParam(schemas.idSchema, 'id'), OwnerController.getDetailOwner);

module.exports = router;
// passport.authenticate('jwt', { session: false }),
