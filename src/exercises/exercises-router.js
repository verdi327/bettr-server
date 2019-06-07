'use strict';

const express = require('express');
const {requireAuth} = require('../middleware/jwt-auth');
const exercisesRouter = express.Router();
const ExerciseService = require('./exercise-service');

exercisesRouter
  .route('/:exercise_title')
  .get(requireAuth, async (req, res, next) => {
    const {exercise_title} = req.params;

    if (!exercise_title) {
      return next({status: 400, message: 'exercise title is required'});
    }

    try {
      const demo_url = await ExerciseService.findByTitle(req.app.get('db'), exercise_title);
      if (!demo_url) {
        return next({status: 404, message: `unable to find exercise with title ${exercise_title}`});
      }
      res.json(demo_url);
    } catch(err) {
      next({status: 500, message: err.message});
    }
  });

module.exports = exercisesRouter;