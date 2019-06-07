'use strict';

const express = require('express');
const workoutsRouter = express.Router();
const {requireAuth} = require('../middleware/jwt-auth');
const CycleService = require('../cycles/cycle-service');
const WorkoutService = require('../workouts/workout-service');
const bodyParser = express.json();

workoutsRouter
  .route('/')
  .get(requireAuth, async (req, res, next) => {
    const user_id = req.user.id;
    const week = req.query.week;
    const db = req.app.get('db');

    try {
      let workouts = [];
      const cycle = await CycleService.findCurrentByUserId(db, user_id);
      if (!cycle) {
        return res.json({workouts});
      }
      
      if (!week) {
        workouts = await WorkoutService.findCurrentWeek(db, cycle.id);
      } else {
        workouts = await WorkoutService.findByWeek(db, cycle.id, week);
      }

      let activeWorkout = await WorkoutService.findCurrentWorkout(db, cycle.id);
      let activeWorkoutId = -1;
      if (activeWorkout) {
        activeWorkoutId = activeWorkout.id;
      }
      
      res.json({workouts, week: workouts[0].week, activeWorkoutId});
    } catch(err) {
      next({status: 500, message: err.message});
    }
    
  });

workoutsRouter
  .route('/:workout_id')
  .get(requireAuth, async (req, res, next) => {
    const {workout_id} = req.params;
    
    try {
      const workout = await WorkoutService.findById(req.app.get('db'), workout_id);
      if (!workout) {
        return next({status: 404, message: `workout with id ${workout_id} not found`});
      }
      res.json(workout);
    } catch(err) {
      next({status: 500, message: err.message});
    }
  })
  .patch(requireAuth, bodyParser, async (req, res, next) => {
    const {workout_id} = req.params;
    const {completed} = req.body;

    try {
      const workout = await WorkoutService.findById(req.app.get('db'), workout_id);
      if (!workout) {
        return next({status: 404, message: `workout with id ${workout_id} not found`});
      }
      
      await WorkoutService.updateWorkout(req.app.get('db'), workout.id, {completed});
      res.status(204).json({});
    } catch(err) {
      next({status: 500, message: err.message});
    }
  });

module.exports = workoutsRouter;
