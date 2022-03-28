const Item = require('../models/Item')

const getAll = async (req, res, next) => {
  const decks = await Item.find({});

  return res.status(200).json(decks);
};

const newItem = async (req, res, next) => {
  // Create a new deck
  const item = req.value.body;

  const newItem = new Item(item);
  await newItem.save();

  return res.status(201).json({ 
    newItem,
    success: true,
  });
}

const updateItem = async (req, res, next) => {
  const _res = await Item.updateMany({color:['Đen', 'Trắng']})
  return res.status(200).json({message:{
    success:true,
    numberUpdate: _res.acknowledged
  }})
}

const getItemID = async (req, res, next) => {
  const { itemID } = req.value.params;

  const item = await Item.findById(itemID);

  return res.status(200).json({ item });
}

module.exports = {
  getAll,
  newItem,
  updateItem,
  getItemID,
};
