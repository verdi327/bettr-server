'use strict';
/* globals supertest */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected Endpoints', function() {
  let db;
  let testUsers = helpers.testUsers();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('seed users', () => helpers.createUsers(db, testUsers));

  const protectedEndpoints = [
    {
      name: 'POST /api/cycles',
      path: '/api/cycles',
      method: supertest(app).post
    },
    {
      name: 'GET /api/cycles/:cycle_id',
      path: '/api/cycles/1',
      method: supertest(app).patch
    },
    {
      name: 'GET /api/auth/current-user',
      path: '/api/auth/current-user',
      method: supertest(app).get
    },
    {
      name: 'GET /api/users/:user_id',
      path: '/api/users/1',
      method: supertest(app).get
    },
    {
      name: 'GET /api/workouts',
      path: '/api/workouts',
      method: supertest(app).get
    },
    {
      name: 'GET /api/workouts/:workout_id',
      path: '/api/workouts/1',
      method: supertest(app).get
    },
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it('returns 401 "Missing bearer token" if no token provided', () => {
        return endpoint.method(endpoint.path)
          .expect(401, {message: 'Missing bearer token'});
      });

      it('returns 401 "Unauthorized request" when invalid JWT secret', () => {
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.createAuthToken(testUsers[0], 'badSecret'))
          .expect(401, { message: 'Unauthorized request' });
      });

      it('returns 401 "Unauthorized request" when invalid email', async () => {
        const invalidUser = await helpers.findByEmail(db, testUsers[0].email);
        invalidUser.email = 'fake@fake.fake';

        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.createAuthToken(invalidUser))
          .expect(401, { message: 'Unauthorized request' });
      });
    });
  });
});