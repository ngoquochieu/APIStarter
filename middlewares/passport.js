const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalJwtStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const { ExtractJwt } = require('passport-jwt');

const { JWT_SECRET, auth } = require('../config/index');

const User = require('../models/User');

// Passport jwt
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);

        if (!user) return done(null, false);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Passport Google
passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: auth.google.CLIENT_ID,
      clientSecret: auth.google.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check whether this current user exists in our database

        // const user = await User.find({authGoogleID:profile.id, authType:'goolge'});
        const user = await User.findOne({ authGoogleID: profile.id });

        if (user) return done(null, user);

        // If new account
        const newUser = new User({
          authType: 'google',
          authGoogleID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.familyName,
          lastName: profile.name.givenName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Passport Facebook
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: auth.facebook.CLIENT_ID,
      clientSecret: auth.facebook.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check whether this current user exists in our database
        const user = await User.findone({ authFacebookID: profile.id });

        if (user) return done(null, user);

        // If new account
        const newUser = new User({
          authType: 'facebook',
          authFacebookID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.familyName,
          lastName: profile.name.givenName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Passport local
passport.use(
  new LocalJwtStrategy(
    {
      // usernameField: 'email'
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);

        const isCorrectPassword = await user.isValidPassword(password);
        if (!isCorrectPassword) return done(null, false);
        // if(user.password !== password) return done(null, false)

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
