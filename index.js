//Config env
require('dotenv').config();
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const logger = require('morgan');
const mongoose = require('mongoose');
const secureApp = require('helmet');
const passport = require('passport');
const  cors = require('cors'); 

const swaggerLoader = require('./loaders/swaggerLoader');
// Set up connect mongodb by mongoose
mongoose
  .connect(process.env.DATABASE, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
  })
  .then(() => console.log('✅ Connected database from mongodb '))
  .catch((error) =>
    console.error(`❌ Connect database is failed with error which is ${error}`)
  );

const app = express();
swaggerLoader(app);
app.use(cors());
app.use(secureApp());
app.use(passport.initialize())

const usersRouter = require('./routers/user');
const decksRouter = require('./routers/deck');
const itemsRouter = require('./routers/item');
const postRouter = require('./routers/post');
const ownerRouter = require('./routers/owner');

//Middleware
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//

//Routers
app.use('/users', usersRouter);
app.use('/decks', decksRouter);
app.use('/items', itemsRouter);
app.use('/posts', postRouter);
app.use('/owner', ownerRouter);
// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  console.log('');
  err.status = 404;
  next(err);
});

//Error handler function
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;

  //response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

//Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
