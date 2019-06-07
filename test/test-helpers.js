'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const WorkoutService = require('../src/workouts/workout-service');

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      cycles,
      workouts
      RESTART IDENTITY CASCADE
    `
  );
}

function createAuthToken(user, secret=process.env.JWT_SECRET, expiry=process.env.JWT_EXPIRY) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    expiresIn: expiry,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

function createNewUserRequest() {
  return {
    full_name: 'foo bar',
    email: 'foo@bar.com',
    password: '123456',
    sex: 'male'
  };
}

function testUsers() {
  return [
    {
      email: 'foo@bar.com',
      full_name: 'John Doe',
      sex: 'male',
      password: 'foobar123'
    },
    {
      email: 'foo@baz.com',
      full_name: 'Jane Smith',
      sex: 'female',
      password: 'foobaz123'
    }
  ];
}

function createUsers(db, users) {
  const preppedUsers = users.map(user => {
    return {...user, password: bcrypt.hashSync(user.password, 1)};
  });

  return db('users')
    .insert(preppedUsers)
    .returning('*')
    .then(rows => rows);
}

function findByEmail(db, email) {
  return db('users').where({email}).first('*');
}

function createCycle(db, cycle) {
  return db('cycles')
    .insert(cycle)
    .returning('*')
    .then(rows => rows[0]);
}

async function createWorkouts(db, cycle_id, training_freq=3) {
  const workouts = await WorkoutService.createWorkouts(cycle_id, training_freq);
  return db('workouts')
    .insert(workouts)
    .returning('*')
    .then(rows => rows);
}

function lastCreatedCycle(db) {
  return db('cycles')
    .select('*')
    .orderBy('created_at', 'DESC')
    .limit(1)
    .then(rows => rows[0]);
}

function findWorkoutById(db, id) {
  return db('workouts').where({id}).first('*');
}

function testCycle() {
  return {training_freq: '3', training_exp: 'beg', user_id: 1};
}

module.exports = {
  cleanTables,
  createAuthToken,
  createNewUserRequest,
  createUsers,
  testUsers,
  findByEmail,
  createCycle,
  createWorkouts,
  lastCreatedCycle,
  findWorkoutById,
  testCycle,
};