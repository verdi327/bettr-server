'use strict';
require('../setup');
const helpers = require('../test-helpers');
const CycleService = require('../../src/cycles/cycle-service');
const knex = require('knex');

describe('CycleService', () => {
  let db;
  const testUsers = helpers.testUsers();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before('clean db', () => helpers.cleanTables(db));
  after('close db', () => db.destroy());
  
  beforeEach('create users', () => helpers.createUsers(db, testUsers));
  afterEach('clean db', () => helpers.cleanTables(db));
  
  describe('findCurrentByUserId', () => {
    context('when no cycle exist for a user', () => {
      it('returns undefined', async () => {
        const user_id = 1;
        const cycle = await CycleService.findCurrentByUserId(db, user_id);
        // eslint-disable-next-line no-unused-expressions
        expect(cycle).to.be.undefined;
      });
    });

    context('when multiple cycles exist', () => {
      it('returns the cycle where completed flag is set to false', async () => {
        const cycle1 = {training_freq: '3', training_exp: 'beg', user_id: 1, completed: true};
        const cycle2 = {training_freq: '4', training_exp: 'beg', user_id: 1};
        await CycleService.insert(db, cycle1);
        await CycleService.insert(db, cycle2);
        const currentCycle = await CycleService.findCurrentByUserId(db, 1);
        expect(currentCycle.training_freq).to.equal('4');
      });
    });
  });
});