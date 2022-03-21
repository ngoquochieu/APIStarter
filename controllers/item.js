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

const getItemID = async (req, res, next) => {
  const { itemID } = req.value.params;

  const item = await Item.findById(itemID);

  return res.status(200).json({ item });
}

module.exports = {
  getAll,
  newItem,
  getItemID,
};
