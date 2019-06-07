'use strict';

const HybridWorkoutService = {
  find(knex) {
    return knex('hybrid_workouts').select('*').orderByRaw('random()');
  }
};

module.exports = HybridWorkoutService;