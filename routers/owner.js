const router = require('express-promise-router')();
const passport = require('passport');

const OwnerController = require('../controllers/owner');

router.route('/').get(OwnerController.index).post(OwnerController.createOwner);

module.exports = router;
// passport.authenticate('jwt', { session: false }),
