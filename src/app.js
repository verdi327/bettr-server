'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const usersRouter = require('./users/users-router');
const cyclesRouter = require('./cycles/cycles-router');
const authRouter = require('./auth/auth-router');
const workoutsRouter = require('./workouts/workouts-router');
const exercisesRouter = require('./exercises/exercises-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(express.json());

// whitelist allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000', 'https://bettr-fit.now.sh', 'https://bettr.fit', 'https://www.bettr.fit'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin - like mobile apps, curl, postman
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/cycles', cyclesRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/exercises', exercisesRouter);
app.use(errorHandler);

function errorHandler(error, req, res, next) {
  const code = error.status || 500;

  if (NODE_ENV === 'production') {
    error.message = code === 500 ? 'internal server error' : error.message;
  } else {
    console.error(error);
  }

  res.status(code).json({ message: error.message });
}

module.exports = app;