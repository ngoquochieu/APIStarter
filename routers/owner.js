const router = require('express-promise-router')();

const OwnerController = require('../controllers/owner');

router.route('/')
  .get(OwnerController.index)
  .post(OwnerController.createOwner)

module.exports = router;
