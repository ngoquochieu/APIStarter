const router = require('express-promise-router')();
const passport = require('passport');

const OwnerController = require('../controllers/owner');

router.route('/').get(OwnerController.index).post(
  // passport.authenticate('jwt', { session: false }),
  OwnerController.createOwner
);

module.exports = router;
