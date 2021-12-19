const User = require('../models/User');
const Deck = require('../models/Deck');

const index = async (req, res, next) => {
  const decks = await Deck.find({});

  return res.status(200).json(decks);
};

const newDeck = async (req, res, next) => {

  // Create a new deck
  const deck = req.value.body;

  const newDeck = new Deck(deck);
  await newDeck.save();

  return res.status(201).json({ deck: newDeck });
};

const getDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const deck = await Deck.findById(deckID);

  return res.status(200).json({ deck });
};

// const replaceDeck = async (req, res, next) => {
//   const { deckID } = req.value.params;
//   const newDeck = req.value.body;

//   //Current deck
//   const deck = await Deck.findById(deckID);

//   //Get current owner deck
//   const currentOwner = await User.findById(deck.owner);

//   //Delete deck in currentOwner
//   currentOwner.decks.pull(deck);
//   currentOwner.save();

//   // Get new owner
//   const newOwnerID = newDeck.owner;
//   const newOwner = await User.findById(newOwnerID);

//   const result = await Deck.findByIdAndUpdate(deckID, newDeck);

//   newOwner.decks.push(result._id);
//   newOwner.save();

//   return res.status(200).json({ success: true });
// };

const updateDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body;

  const result = await Deck.findByIdAndUpdate(deckID, newDeck);

  return res.status(200).json({ success: true });
};

const deleteDeck = async (req, res, next) => {
  const { deckID } = req.value.params;

  //Get a deck
  const deck = await Deck.findById(deckID);

  const owners = await User.find({decks: deckID});

  owners.forEach(owner => {
    owner.decks.pull(deckID);
    owner.save();
  });

  //Remove the deck
  await deck.remove();

  return res.status(200).json({ success: true });
};

module.exports = {
  index,
  newDeck,
  getDeck,
  // replaceDeck,
  updateDeck,
  deleteDeck,
};
