'use strict';

const CardioWorkoutService = {
  find(knex, type, sub_type) {
    return knex.raw(`
      select ("desc")
      from cardio_workouts
      where tags @> '{"${type}", "${sub_type}"}'
      order by random();
    `);
  }
};

module.exports = CardioWorkoutService;