'use strict';
/* globals supertest */
const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
require('./setup');

describe('Exercises Endpoints', () => {
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

  describe('GET /api/exercises/:exercise_title', () => {
    it('returns the demo_url for a given exercise', () => {
      const exercise_title = 'Front Rack Barbell Lunge';
      const encodedTitle = encodeURI(exercise_title);
      const expectedUrl = 'https://www.youtube.com/watch?v=f3WLs_HutLw';

      return supertest(app)
        .get(`/api/exercises/${encodedTitle}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', helpers.createAuthToken(testUsers[0]))
        .expect(200)
        .then(res => {
          expect(res.body.demo_url).to.equal(expectedUrl);
        });
    });
    
  });
});