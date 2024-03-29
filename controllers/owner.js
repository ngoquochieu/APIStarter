const Owner = require('../models/Owner');
const User = require('../models/User');
const index = async (req, res, next) => {
  const owners = await Owner.find({});
  return res.status(200).json({ message: 'GET SUCCESSFUL', data: owners });
};

const createOwner = async (req, res, next) => {
  // const userID = req.user.id;
  const { userID } = req.body;
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
    denomina,
    banner,
    img,
    address,
  } = req.body;
  // console.log(req.body);
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
    location: { lat, lon },
    type,
    denomina,
    banner,
    img,
    address,
  });
  if (newOwner) {
    const owner = await newOwner.save();
    user.page = owner;
    user.isPage = true;
    user.save();
    return res.status(201).json({ message: 'Create success!' });
  }
  return res.status(403).json({ error: { message: 'Failed create!' } });
};
const editOwner = async (req, res, next) => {
  const { id } = req.value.params;
  const { lat, lon, isPublic } = req.body;
  console.log(typeof req.body.isPublic);
  const updateOwner = await Owner.findByIdAndUpdate(
    id,
    { location: { lat, lon } }
    // { isPublic: isPublic }
  );
  updateOwner.isPublic = isPublic;
  if (updateOwner) {
    updateOwner.save();
    return res.status(201).json({ message: 'UPDATE_SUCCESS' });
  }
  return res.status(403).json({ message: 'UPDATE_FAIL' });
};
const getDetailOwner = async (req, res, next) => {
  const { id } = req.value.params;
  const owner = await Owner.findById(id);
  if (owner) {
    res.status(200).send({ message: 'GET_DETAIL_SUCCESS', data: owner });
  } else {
    res.status(401).send({ message: 'GET_DETAIL_FAIL', data: {} });
  }
};
const deleteOwner = async (req, res, next) => {
  try {
    const { id } = req.value.params;
    const { userID } = req.body;
    const user = await User.findById(userID);
    const deleteOwner = await Owner.deleteOne({ _id: id });
    if (deleteOwner) {
      user.page = {};
      user.isPage = false;
      await user.save();
      res.status(202).send({ message: 'DELETE_SUCCESS' });
    } else {
      res.status(401).send({ message: 'DELETE_FAIL' });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  index,
  createOwner,
  editOwner,
  getDetailOwner,
  deleteOwner,
};
