const Deck = require('../models/Deck');
const User = require('../models/User');
const Owner = require('../models/Owner');

const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/index');
const mailer = require('../helpers/mailer');
const bcrypt = require('bcryptjs');

const encodedToken = (userID) => {
  return JWT.sign(
    {
      iss: 'Quoc Hieu',
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    JWT_SECRET
  );
};

const authGoogle = async (req, res, next) => {
  const token = encodedToken(req.user._id);

  res.setHeader('Authorization', token);
  res.status(200).json({ status: true });
};

const authFacebook = async (req, res, next) => {
  const token = encodedToken(req.user._id);

  res.setHeader('Authorization', token);
  res.status(200).json({ status: true });
};

const signUp = async (req, res, next) => {
  const { fullname, password, phone, email, avatar, birth, gender } = req.body;

  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, 10);

  const foundUserEmail = await User.findOne({ email });
  if (foundUserEmail)
    return res
      .status(403)
      .json({ error: { message: 'Email is already in use. ' } });

  //Create new user
  const newUser = await new User({
    fullname,
    password: passwordHashed,
    phone,
    email,
    avatar,
    birth,
    gender,
    page: {},
    post: [],
    isPage: false,
  });
  if (newUser) {
    // const emaildHashed = await bcrypt.hash(email, 10);
    // mailer.sendMail(
    //   email,
    //   'Verify mail',
    //   `<a href = "${process.env.URL}/users/verify?email=${email}&token=${emaildHashed}"> Verify</a>`
    // );
  } else {
    return res
      .status(403)
      .json({ error: { message: 'Account creation failed' } });
  }
  await newUser.save();
  return res.status(201).json({ status: true });

  // const token = encodedToken(newUser._id);
  // res.setHeader('Authorization', token);
};

const signIn = async (req, res, next) => {
  try {
    if (req.user) {
      const token = encodedToken(req.user._id);
      res.setHeader('Authorization', token);
      return res.status(200).json({
        status: true,
        user: {
          token,
          userID: req.user._id,
          fullName: req.user.fullname,
          email: req.user.email,
          avatar: req.user.avatar,
          birth: req.user.birth,
          gender: req.user.gender,
          phone: req.user.phone,
          role: req.user.role,
          page: req.user.page,
          post: req.user.post,
          isPage: req.user.isPage,
        },
      });
    } else {
      return res.status(401).json({ message: 'Login fail' });
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.value.body;
  const user = await User.findOne({ email });
  if (email) {
    const emaildHashed = await bcrypt.hash(email, 10);
    mailer.sendMail(
      email,
      'Verify mail',
      `<a href = "${process.env.URL}/users/confirmEmail?email=${email}&token=${emaildHashed}"> Confirm Email</a>`
    );
    return res.status(200).json({ status: true });
  }
  return res.status(403).json({ error: { message: 'Email is not found' } });
};

const resetPassword = async (req, res, next) => {
  const { userID, password } = req.body;
  const passwordHashed = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(
    { _id: userID },
    { password: passwordHashed }
  );

  if (user) {
    const a = await user.save();
    console.log(a);
    return res.status(200).json({ status: true });
  } else return res.status(403).json({ status: false });
};

const confirmEmail = async (req, res, next) => {
  const { email, token } = req.query;
  bcrypt.compare(email, token, async (err, result) => {
    if (result) {
      return res.status(200).json({
        status: true,
        email,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: 'Confirm failure',
      });
    }
  });
};
const secrect = async (req, res, next) => {
  return res.status(200).json({ resource: true });
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
  const { email } = req.value.body;

  const user = await User.findOne({ email });
  if (user)
    return res.status(400).json({ error: { message: 'Email already in use' } });

  const newUser = await new User(req.value.body);

  await newUser.save();

  return res.status(201).json({ status: true });
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
  try {
    const { userID } = req.value.params;

    const newUser = req.body;

    const result = await User.findByIdAndUpdate(userID, newUser);

    return res
      .status(200)
      .json({ message: 'UPDATE_USER_SUCCESS', data: result });
  } catch (error) {
    return res.status(401).json({ message: 'UPDATE_USER_FALID', data: result });
  }
};

const deleteUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const user = await User.findById({ _id: userID });
  const idOwner = user.page._id ? user.page._id.toString() : '';
  try {
    await User.deleteOne({ _id: userID });
    if (idOwner) {
      await Owner.deleteOne({ _id: idOwner });
    }
    return res.status(200).send({ message: 'DELETE_SUCCESSFUL' });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: 'DELETE_NOT_SUCCESSFUL' });
  }
};

const sendEmail = async (req, res, next) => {
  mailer.sendMail(
    'ngoquochieu06112001@gmail.com',
    'Verify mail',
    `<a href = "${process.env.URL}/users/verify"> Verify</a>`
  );
};

const verify = async (req, res, next) => {
  const { email, token } = req.query;
  bcrypt.compare(email, token, async (err, result) => {
    if (result) {
      const isUpdate = await User.findOneAndUpdate(
        { email },
        { verify: new Date().getTime() + 300 * 1000 }
      );
      // console.log(isUpdate.verify)
      return isUpdate && res.status(200).json({ status: true });
    } else {
      return res.status(401).json({
        status: true,
        message: 'Confirm failure',
      });
    }
  });
};

const compare = async (req, res, next) => {
  const user = await User.findOne({ email: 'ngoquochieu06112001@gmail.com' });
  const isCorrectPassword = await bcrypt.compare(
    '123123',
    '$2a$10$5YzeRfJm1oEQI68blYGoRuQuTEWIUaDeABPZMK9NVcJVuWzUaD25G'
  );
  console.log(isCorrectPassword);
};

module.exports = {
  compare,
  authGoogle,
  authFacebook,
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  confirmEmail,
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
