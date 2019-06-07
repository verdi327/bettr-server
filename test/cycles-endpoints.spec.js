'use strict';
/* globals supertest */
const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
require('./setup');

describe('Cycles Endpoints', () => {
  let db;
  let testUsers = helpers.testUsers();

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
  beforeEach('seed users', () => helpers.createUsers(db, testUsers));

  describe('POST /api/cycles', () => {
    const requiredFields = ['training_exp', 'training_freq', 'injuries'];
    requiredFields.forEach(field => {
      it(`returns 400 and error message when ${field} is missing`, () => {
        const requestBody = {training_exp: 'beg', training_freq: '3', injuries: ['none']};
        delete requestBody[field];

        return supertest(app)
          .post('/api/cycles')
          .set('Content-Type', 'application/json')
          .set('Authorization', helpers.createAuthToken(testUsers[0]))
          .send(requestBody)
          .expect(400, {message: `${field} is required`});
      });
    });

    it('returns 400 and error message when training_exp is NOT  one of "beg", "int", or "adv"', () => {
      const requestBody = {training_exp: 'foo', training_freq: '3', injuries: ['none']};

      return supertest(app)
        .post('/api/cycles')
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .send(requestBody)
        .expect(400, {message: 'training experience must be one of beg, int or adv'});
    });

    it('returns 400 and error message when training_freq is NOT  one of 3,4,5', () => {
      const requestBody = {training_exp: 'beg', training_freq: '8', injuries: ['none']};

      return supertest(app)
        .post('/api/cycles')
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .send(requestBody)
        .expect(400, {message: 'training frequency must be one of 3, 4 or 5'});
    });

    it('returns 400 and error message when injuries includes invalid type', () => {
      const requestBody = {training_exp: 'beg', training_freq: '3', injuries: ['fake']};

      return supertest(app)
        .post('/api/cycles')
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .send(requestBody)
        .expect(400, {message: 'invalid injury type'});
    });

    it('creates a new cycle', () => {
      const requestBody = {training_exp: 'beg', training_freq: '3', injuries: ['none']};

      return supertest(app)
        .post('/api/cycles')
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .send(requestBody)
        .expect(201)
        .then(res => {
          expect(res.body.workouts.length).to.equal(7);
        });
    });
    
  });

  describe('PATCH /api/cycles/:cycle_id', () => {
    const cycle = {training_exp: 'beg', training_freq: '4', user_id: 1};
    beforeEach('create cycle', () => helpers.createCycle(db, cycle));

    it('returns 404 when no cycle is found', () => {
      return supertest(app)
        .patch('/api/cycles/99999')
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .send({completed: true})
        .expect(404, {message: 'unable to find cycle with id 99999'});
    });

    it('sets the completed col on cycle to true', async () => {
      let savedCycle = await helpers.lastCreatedCycle(db);

      return supertest(app)
        .patch(`/api/cycles/${savedCycle.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .send({completed: true})
        .expect(204)
        .then(async () => {
          // eslint-disable-next-line no-unused-expressions
          expect(savedCycle.completed).to.be.false;
          savedCycle = await helpers.lastCreatedCycle(db);
          // eslint-disable-next-line no-unused-expressions
          expect(savedCycle.completed).to.be.true;
        });
    });
  });
});