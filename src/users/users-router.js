'use strict';

const express = require('express');
const usersRouter = express.Router();
const bodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');
const UserService = require('./user-service.js');
const AuthService = require('../auth/auth-service');
const CycleService = require('../cycles/cycle-service');
const WorkoutService = require('../workouts/workout-service');

usersRouter
  .route('/')
  .post(bodyParser, async (req, res, next) => {
    const {full_name, email, password, sex} = req.body;
    const user = {full_name, email, password, sex};

    for (const [key, value] of Object.entries(user)) {
      if (!value) {
        return next({status: 400, message: `${key} is required`});
      } else if (value.startsWith(' ') || value.endsWith(' ')) {
        return next({status: 400, message: `${key} cannot begin or end with spaces`});
      }
    }

    const response = UserService.validateUserFields(user);
    if (response.error) {
      return next({status: 400, message: response});
    }

    try {
      user.password = await UserService.hashPassword(user.password);
    
      const savedUser = await UserService.insert(req.app.get('db'), user);
      delete savedUser.password;

      const sub = savedUser.email;
      const payload = { user_id: savedUser.id };
      const authToken = await AuthService.createJwt(sub, payload);
      savedUser.authToken = authToken;

      res
        .status(201)
        .location(`/api/users/${savedUser.id}`)
        .json(savedUser);
    } catch(err) {
      next({message: err.message});
    }
  });

usersRouter
  .route('/:user_id')
  .get(requireAuth, async (req, res, next) => {
    try {
      const {full_name, sex} = req.user;
      let cycle = await CycleService.findCurrentByUserId(req.app.get('db'), req.user.id);
      if (!cycle) {
        cycle = await CycleService.lastCompletedCycle(req.app.get('db'), req.user.id);
      }
      const {training_exp, training_freq} = cycle;
      const currentWorkout = await WorkoutService.findCurrentWorkout(req.app.get('db'), cycle.id);
      if (!currentWorkout) {
        return next({status: 404, message: `unable to find current workout for cycle with id ${cycle.id}`});
      }
      const day = (currentWorkout.week*7) - (7-currentWorkout.day);
      const phase = currentWorkout.phase;
      const completed_percent = Number(day/84*100).toFixed();
      const currentUser = {full_name, sex, training_exp, training_freq};
      const currentCycle = {day, phase, completed_percent};

      res.json({currentUser, currentCycle});
    } catch(err) {
      next({status: 500, message: err.message});
    }
  });
  

module.exports = usersRouter;