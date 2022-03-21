/**
 * We can interact with mongoose in three different ways:
 * [v] Callback
 * [V] Promises
 * [V] Async/Await (Promises)
 */
const Deck = require('../models/Deck');
const User = require('../models/User');

const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/index');

const encodedToken = (userID) => {
    return JWT.sign({
        iss:'Quoc Hieu',
        sub: userID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    },JWT_SECRET)
}

const authGoogle = async (req, res, next) => {
  const token = encodedToken(req.user._id);

  res.setHeader('Authorization', token);
  res.status(200).json({success: true});
}

const authFacebook = async (req, res, next) => {
  const token = encodedToken(req.user._id);

  res.setHeader('Authorization', token);
  res.status(200).json({success: true});
}

const signUp = async (req, res, next) => {
  const {fullname, password, phone, username} = req.value.body;

  //Check if there is a user same username
  const foundUser = await User.findOne({username});
  if(foundUser) return res.status(403).json({error: {message: "Username is already in use. "}})

  //Create new user
  const newUser = await new User({fullname, username, password, phone});
  await newUser.save();

  // const token = encodedToken(newUser._id);
  // res.setHeader('Authorization', token);
  
  res.status(201).json({success:true});
};

const signIn = async (req, res, next) => {
  const token = encodedToken(req.user._id)
  
  res.setHeader('Authorization', token);
  return res.status(200).json({
    success: true,
    token,
  });
};

const secrect = async (req, res, next) => {
  return res.status(200).json({resource: true})
};

const getUser = async (req, res, next) => {
  const { userID } = req.value.params;

  const user = await User.findById(userID);

  return res.status(200).json({ user });
};

const getUserDecks = async (req, res, next) => {
  const { userID } = req.value.params;

  const user = await User.findById(userID).populate('decks');

  return res.status(200).json({ decks: user.decks });
};

const index = async (req, res, next) => {
  const user = await User.find({});

  return res.status(200).json(user);
};

const newUser = async (req, res, next) => {
  const {email} = req.value.body;

  const user = await User.findOne({email});
  if(user) return res.status(400).json({error:{message:'Email already in use'}})

  const newUser = await new User(req.value.body);

  await newUser.save();

  return res.status(201).json({ success: true });
};

const newUserDeck = async (req, res, next) => {
  const { userID } = req.value.params;

  //Create a new deck
  const newDeck = new Deck(req.value.body);

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

  return res.status(201).json({ success: true });
};

// const replaceUser = async (req, res, next) => {
//   //enforce new user to old user
//   const { userID } = req.value.params;

//   const newUser = req.value.body;

//   const result = await User.findByIdAndUpdate(userID, newUser);

//   return res.status(200).json({ success: true });
// };

const updateUser = async (req, res, next) => {
  //number of fields
  const { userID } = req.value.params;

  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(userID, newUser);

  return res.status(200).json({ message: {success: true }});
};

const deleteUser = async (req, res, next) => {
  const {userID} = req.value.params; 
}

module.exports = {
  authGoogle,
  authFacebook,
  signUp,
  signIn,
  secrect,
  getUser,
  getUserDecks,
  index,
  newUser,
  newUserDeck,
  // replaceUser,
  updateUser,
  deleteUser
};
