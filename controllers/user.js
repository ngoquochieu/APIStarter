/**
 * We can interact with mongoose in three different ways:
 * [v] Callback
 * [V] Promises
 * [V] Async/Await (Promises)
 */
const Deck = require('../models/Deck');
const User = require('../models/User');

const getUser = async(req, res, next) => {
    const {userID} = req.value.params;

    const user = await User.findById(userID);

    return res.status(200).json({user});
}

const getUserDecks = async(req, res, next) => {
    const {userID} = req.value.params;

    const user = await User.findById(userID).populate('decks')

    return res.status(200).json({decks: user.decks})

}

const index = async (req, res, next) => {
    const user = await User.find({})

    return res.status(200).json(user);   
}

const newUser = async (req, res, next) => {

    const newUser = await new User(req.value.body);
    
    await newUser.save();
     
    return res.status(201).json({user : newUser});
}

const newUserDeck = async (req, res, next) => {
    const {userID} = req.value.params;

    //Create a new deck
    const newDeck = new Deck(req.value.body)

    //Get user
    const user = await User.findById(userID);

    //Assign user as a deck's owner
    newDeck.owner = user;

    //Save the deck
    await newDeck.save();

    //Add deck to user's  decks array 'decks'
    user.decks.push(newDeck._id);

    //Save user
    await user.save();

    return res.status(201).json({deck: newDeck});
}

const replaceUser = async (req, res, next) => {
    //enforce new user to old user
    const {userID} = req.value.params;

    const newUser = req.value.body;

    const result = await User.findByIdAndUpdate(userID, newUser);

    return res.status(200).json({success: true});
}

const updateUser = async (req, res, next) => {
    //number of fields
    const {userID} = req.value.params;

    const newUser = req.value.body;

    const result = await User.findByIdAndUpdate(userID, newUser);

    return res.status(200).json({success: true});
}

module.exports = {
    getUser,
    getUserDecks,
    index,
    newUser,
    newUserDeck,
    replaceUser,
    updateUser,
}