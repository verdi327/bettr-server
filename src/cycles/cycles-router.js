'use strict';

const express = require('express');
const cyclesRouter = express.Router();
const bodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');
const CycleService = require('./cycle-service');
const WorkoutService = require('../workouts/workout-service');

cyclesRouter
  .route('/')
  .post(requireAuth, bodyParser, async (req, res, next) => {
    const {training_exp, training_freq, injuries} = req.body;
    const newCycle = {training_exp, training_freq, injuries};

    for (const [key, value] of Object.entries(newCycle)) {
      if (!value) {
        return next({status: 400, message: `${key} is required`});
      }
    }

    if (!['beg', 'int', 'adv'].includes(training_exp)) {
      return next({status: 400, message: 'training experience must be one of beg, int or adv'});
    }

    if (!['3', '4', '5'].includes(training_freq)) {
      return next({status: 400, message: 'training frequency must be one of 3, 4 or 5'});
    }
    
    for (const injury of injuries) {
      if (!['shoulder', 'hip', 'knee', 'ankle', 'lower_back', 'upper_back', 'none'].includes(injury)) {
        return next({status: 400, message: 'invalid injury type'});
      }
    }

    newCycle.user_id = req.user.id;
    try {
      const savedCycle = await CycleService.insert(req.app.get('db'), newCycle);
      const workouts = await WorkoutService.createWorkouts(savedCycle.id, savedCycle.training_freq);
      const savedWorkouts = await WorkoutService.insert(req.app.get('db'), workouts);
      savedCycle.workouts = savedWorkouts.slice(0, 7);
      res.status(201).json(savedCycle);
    } catch(err) {
      next({status: 500, message: err.message});
    }
  });

cyclesRouter
  .route('/:cycle_id')
  .patch(requireAuth, bodyParser, async (req, res, next) => {
    const {cycle_id} = req.params;
    try {
      const cycle = await CycleService.findById(req.app.get('db'), cycle_id);
      if (!cycle) {
        return next({status: 404, message: `unable to find cycle with id ${cycle_id}`});
      }
      await CycleService.update(req.app.get('db'), cycle.id, {completed: true});
      res.status(204).json({});
    } catch(err) {
      next({status: 500, message: err.message});
    }   
  });

module.exports = cyclesRouter;