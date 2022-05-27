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
const mailer = require('../helpers/mailer'); 
const bcrypt = require('bcryptjs');
 const salt = 'ngoquochieu';

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
  const {fullname, password, phone, username, email} = req.value.body;

  //Check if there is a user same username
  const foundUserName = await User.findOne({username});
  if(foundUserName) return res.status(403).json({error: {message: "Username is already in use. "}})

  const foundUserEmail = await User.findOne({email});
  if(foundUserEmail) return res.status(403).json({error: {message: "Email is already in use. "}})

  //Create new user
   const newUser = await new User({fullname, username, password, phone, email});
   if(newUser) {

    const emaildHashed = await  bcrypt.hash(email, 10);
    mailer.sendMail(email, 'Verify mail' , `<a href = "${process.env.URL}/users/verify?email=${email}&token=${emaildHashed}"> Verify</a>`)
   
  }
   else {
     return res.status(403).json({error: {message: "Account creation failed"}})
   }
   await newUser.save();
   return res.status(201).json({success:true});

  // const token = encodedToken(newUser._id);
  // res.setHeader('Authorization', token);
  
   
};

const signIn = async (req, res, next) => {
  const token = encodedToken(req.user._id)
  
  res.setHeader('Authorization', token);
  return res.status(200).json({
    success: true,
    token,
    username: req.user.fullname,
    address: req.user.address,
    phone: req.user.phone,
    email: req.user.email,
    userID: req.user._id,
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

const sendEmail = async (req, res, next) => {
  mailer.sendMail('ngoquochieu06112001@gmail.com', 'Verify mail', `<a href = "${process.env.URL}/users/verify"> Verify</a>`);
}

const verify = async (req, res, next) => {
  const {email, token} = req.query;
   bcrypt.compare(email, token, async (err, result) => {
    if(result) {
      const isUpdate = await User.findOneAndUpdate({email}, {verify: new Date().getTime() + 300 * 1000})
      return isUpdate && res.status(200).json({message: {success:true}})
    }else{
      return res.status(401).json({message: {success: false}})
    }
  })
  
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
  deleteUser,
  sendEmail,
  verify,
};
