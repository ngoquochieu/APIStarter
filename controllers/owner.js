const Owner = require('../models/Owner');
const User = require('../models/User');
const index = async (req, res, next) => {
  const owners = await Owner.find({});
  return res.status(200).json({ message: 'GET SUCCESSFUL', data: owners });
};

const createOwner = async (req, res, next) => {
  const userID = req.user.id;
  const user = await User.findById({ _id: userID });
  const {
    name,
    description,
    introduce,
    phone,
    website,
    priceStart,
    priceEnd,
    open,
    close,
    ratting,
    lat,
    lon,
    type,
  } = req.body;
  const newOwner = await new Owner({
    name,
    description,
    introduce,
    phone,
    website,
    priceStart,
    priceEnd,
    open,
    close,
    ratting,
    location: { lat, lon },
    type,
  });
  if (newOwner) {
    const owner = await newOwner.save();
    user.page = owner;
    user.save();
    return res.status(201).json({ message: 'Create success!' });
  }
  return res.status(403).json({ error: { message: 'Failed create!' } });
};
module.exports = {
  index,
  createOwner,
};
