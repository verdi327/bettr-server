'use strict';

const ExerciseService = {
  find(knex, movement, category, sub_type) {
    let tagQuery;
    if (sub_type) {
      tagQuery = `'{"${sub_type}", "${category}"}'`;
    } else {
      tagQuery = `'{"${category}"}'`;
    }

    return knex.raw(`
      select (title)
      from exercises
      where movement = '${movement}'
      AND
      tags @> ${tagQuery}
      order by random();
    `);
  },

  findMainPower(knex) {
    return knex.raw(`
      select (title)
      from exercises
      where tags @> '{"main", "power"}'
      order by random();
    `);
  }

};

module.exports = ExerciseService;