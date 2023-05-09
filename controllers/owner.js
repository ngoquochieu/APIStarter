const Owner = require('../models/Owner');
const index = async (req, res, next) => {
  const owners = await Owner.find({});
  return res.status(200).json({ message: 'GET SUCCESSFUL', data: owners });
};

const createOwner = async (req, res, next) => {
  const {
    name,
    description,
    introduce,
    phone,
    website,
    price,
    open,
    close,
    ratting,
    lat,
    lon,
  } = req.body;
  const newOwner = await new Owner({
    name,
    description,
    introduce,
    phone,
    website,
    price,
    open,
    close,
    ratting,
    location: { lat, lon },
  });
  if (newOwner) {
    await newOwner.save();
    return res.status(201).json({ message: 'Create success!' });
  }
  return res.status(403).json({ error: { message: 'Failed create!' } });
};
module.exports = {
  index,
  createOwner,
};
