const User = require('../models/User');
const Deck = require('../models/Deck');

const index = async (req, res, next) => {
  const decks = await Deck.find({});

  return res.status(200).json(decks);
};

const newDeck = async (req, res, next) => {
  // Find owner
  const owner = await User.findById(req.value.body.owner);

  // Create a new deck
  const deck = req.value.body;
  delete deck.owner;

  deck.owner = owner._id;
  const newDeck = new Deck(deck);
  await newDeck.save();

  // Add newly created deck to the actual decks
  owner.decks.push(newDeck._id);
  await owner.save();

  return res.status(201).json({ deck: newDeck });
};

const getDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const deck = await Deck.findById(deckID);

  return res.status(200).json({ deck });
};

const replaceDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body;

  //Current deck
  const deck = await Deck.findById(deckID);

  //Get current owner deck
  const currentOwner = await User.findById(deck.owner);

  //Delete deck in currentOwner
  currentOwner.decks.pull(deck);
  currentOwner.save();

  // Get new owner
  const newOwnerID = newDeck.owner;
  const newOwner = await User.findById(newOwnerID);

  const result = await Deck.findByIdAndUpdate(deckID, newDeck);

  newOwner.decks.push(result._id);
  newOwner.save();

  return res.status(200).json({ success: true });
};

const updateDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body;

  //Current deck
  const deck = await Deck.findById(deckID);

  //Get current owner deck
  const currentOwner = await User.findById(deck.owner);

  //Delete deck in currentOwner
  currentOwner.decks.pull(deck);
  currentOwner.save();

  // Get new owner
  const newOwnerID = newDeck.owner;
  const newOwner = await User.findById(newOwnerID);

  const result = await Deck.findByIdAndUpdate(deckID, newDeck);

  newOwner.decks.push(result._id);
  newOwner.save();

  return res.status(200).json({ success: true });
};

const deleteDeck = async (req, res, next) => {
  const { deckID } = req.value.params;

  //Get a deck
  const deck = await Deck.findById(deckID);

  //Get a owner
  const ownerID = deck.owner;
  const owner = await User.findById(ownerID);

  //Remove the deck
  await deck.remove();

  //Remove deck from owner's decks list
  owner.decks.pull(deck);
  await owner.save();

  return res.status(200).json({ success: true });
};

module.exports = {
  index,
  newDeck,
  getDeck,
  replaceDeck,
  updateDeck,
  deleteDeck,
};
