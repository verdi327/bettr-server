'use strict';

const CycleService = {
  insert(knex, cycle) {
    return knex('cycles')
      .insert(cycle)
      .returning('*')
      .then(rows => rows[0]);
  },

  findCurrentByUserId(knex, user_id) {
    return knex('cycles')
      .where({
        user_id: user_id,
        completed: false
      })
      .first('*');
  },

  lastCompletedCycle(knex, user_id) {
    return knex('cycles')
      .where({
        user_id,
        completed: true
      })
      .orderBy('created_at', 'DESC')
      .limit(1)
      .first('*');
  },

  findById(knex, id) {
    return knex('cycles').where({id}).first('*');
  },

  update(knex, id, body) {
    return knex('cycles')
      .where({id})
      .update(body);
  }
};

module.exports = CycleService;

