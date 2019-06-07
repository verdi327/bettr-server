'use strict';
/* globals supertest */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const AuthService = require('../src/auth/auth-service');

describe('Auth Endpoints', function() {
  let db;
  let testUsers = helpers.testUsers();
  const testUser = testUsers[0];

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

  describe('POST /api/auth/login', () => {
    const requiredFields = ['email', 'password'];
    requiredFields.forEach(field => {
      it(`returns 400 and error message when ${field} is missing`, () => {
        const requestBody = {email: testUser.email, password: testUser.password};
        delete requestBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(400, {message: 'email and password required'});
      });
    });

    it('return 401 when invalid email', () => {
      const requestBody = {email: 'fake@fake.fake', password: testUser.password};

      return supertest(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(401, {message: 'invalid email or password'});
    });

    it('return 401 when invalid password', () => {
      const requestBody = {email: testUser.email, password: 'justPlainWrong'};

      return supertest(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(401, {message: 'invalid email or password'});
    });

    it('return 200, authToken and user when successful', async () => {
      const user = await helpers.findByEmail(db, testUser.email);
      const requestBody = {email: testUser.email, password: testUser.password};
      const expectedToken = AuthService.createJwt(testUser.email, {user_id: user.id});

      return supertest(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(200)
        .then(res => {
          expect(res.body.authToken).to.equal(expectedToken);
          expect(res.body.user.id).to.equal(user.id);
          expect(res.body.user.email).to.equal(user.email);
          // eslint-disable-next-line no-unused-expressions
          expect(res.body.user.password).to.be.undefined;
        });
    });
  });

  describe('GET /api/auth/current-user', () => {
    it('returns 200 and user with password, created_at and updated_at removed', () => {
      return supertest(app)
        .get('/api/auth/current-user')
        .set('Authorization', helpers.createAuthToken(testUser))
        .expect(200)
        .then(res => {
          expect(res.body.id).to.equal(1);
          expect(res.body.full_name).to.equal(testUser.full_name);
          expect(res.body.email).to.equal(testUser.email);
          // eslint-disable-next-line no-unused-expressions
          expect(res.body.password).to.be.undefined;
          // eslint-disable-next-line no-unused-expressions
          expect(res.body.hasCurrentCycle).to.be.false;
        });
    });
  });

});
