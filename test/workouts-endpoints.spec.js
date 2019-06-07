'use strict';
/* globals supertest */
const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
require('./setup');

describe('Workouts Endpoints', () => {
  let db;
  let testUsers = helpers.testUsers();
  const testCycle = {training_freq: '3', training_exp: 'beg', user_id: 1};

  before('connect db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });

    app.set('db', db);
  });

  before('clear table data', () => helpers.cleanTables(db));
  afterEach('clear table data', () => helpers.cleanTables(db));
  after('close db connection', () => db.destroy());
  beforeEach('seed users, cycle and workouts', async () => {
    await helpers.createUsers(db, testUsers);
    await helpers.createCycle(db, testCycle);
    await helpers.createWorkouts(db, 1, 3);
  });

  describe('GET /api/workouts', () => {
    context('when no workouts for exist for a user', () => {
      it('returns an empty array', () => {
        return supertest(app)
          .get('/api/workouts')
          .set('Authorization', helpers.createAuthToken(testUsers[1]))
          .expect(200, {workouts: []});
      });
    });

    context('when no query string is present', () => {
      it('returns the current week of workouts, week and activeWorkoutId', () => {
        return supertest(app)
          .get('/api/workouts')
          .set('Authorization', helpers.createAuthToken(testUsers[0]))
          .expect(200)
          .then(res => {
            const sameWeek = res.body.workouts.filter(w => w.week === res.body.week);
            expect(sameWeek.length).to.equal(7);
            expect(res.body.activeWorkoutId).to.equal(1);
          });
      });
    });

    context('when "week" query string is present', () => {
      it('returns the current week of workouts', () => {
        return supertest(app)
          .get('/api/workouts?week=5')
          .set('Authorization', helpers.createAuthToken(testUsers[0]))
          .expect(200)
          .then(res => {
            const sameWeek = res.body.workouts.filter(w => w.week === 5);
            expect(sameWeek.length).to.equal(7);
            expect(res.body.activeWorkoutId).to.equal(1);
          });
      });
    });
  });

  describe('GET /api/workouts/:workout_id', () => {
    it('returns 404 when unable to find workout', () => {
      return supertest(app)
        .get('/api/workouts/99999')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .expect(404, {message: 'workout with id 99999 not found'});
    });

    it('returns the workout by id', async () => {
      const workout = await helpers.findWorkoutById(db, 1);
      return supertest(app)
        .get(`/api/workouts/${workout.id}`)
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .expect(200)
        .then(res => {
          expect(res.body.id).to.equal(workout.id);
          expect(res.body.type).to.equal(workout.type);
          expect(res.body.day).to.equal(workout.day);
        });
    });
  });

  describe('PATCH /api/workouts/:workout_id', () => {
    it('returns 404 when unable to find workout', () => {
      return supertest(app)
        .patch('/api/workouts/99999')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .expect(404, {message: 'workout with id 99999 not found'});
    });

    it('updates workouts and returns nothing', async () => {
      let workout = await helpers.findWorkoutById(db, 1);
      return supertest(app)
        .patch(`/api/workouts/${workout.id}`)
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .send({completed: true})
        .expect(204)
        .then(async () => {
          expect(workout.completed).to.equal(false);
          workout = await helpers.findWorkoutById(db, 1);
          expect(workout.completed).to.equal(true);
        });
    });
  });

});