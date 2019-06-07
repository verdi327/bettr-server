'use strict';
require('../setup');
const helpers = require('../test-helpers');
const WorkoutService = require('../../src/workouts/workout-service');
const MainTable = require('../../src/workouts/main-table');
const AccTable = require('../../src/workouts/acc-table');
const ExerciseService = require('../../src/exercises/exercise-service');
const WarmUpTable = require('../../src/workouts/warm-up-table');
const FocusTable = require('../../src/workouts/focus-table');
const knex = require('knex');

describe('WorkoutService', () => {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before('clean tables', () => helpers.cleanTables(db));
  after('close db', () => db.destroy());

  describe('setPhase', () => {
    it('calculates the phase based on the week', () => {
      expect(WorkoutService.setPhase(1)).to.equal('acc');
      expect(WorkoutService.setPhase(2)).to.equal('acc');
      expect(WorkoutService.setPhase(3)).to.equal('acc');
      expect(WorkoutService.setPhase(4)).to.equal('acc');
      expect(WorkoutService.setPhase(5)).to.equal('int');
      expect(WorkoutService.setPhase(6)).to.equal('int');
      expect(WorkoutService.setPhase(7)).to.equal('int');
      expect(WorkoutService.setPhase(8)).to.equal('int');
      expect(WorkoutService.setPhase(9)).to.equal('peak');
      expect(WorkoutService.setPhase(10)).to.equal('peak');
      expect(WorkoutService.setPhase(11)).to.equal('peak');
      expect(WorkoutService.setPhase(12)).to.equal('deload');
    });
  });

  describe('setType', () => {
    context('when phase is deload', () => {
      it('returns rest regardless of day or training freq', () => {
        const type = WorkoutService.setType(1, 3, 'deload');
        expect(type).to.equal('rest');
      });
    });

    context('when day is 1,3,5 and phase is acc or int', () => {
      it('returns weights regardless of training freq', () => {
        expect(WorkoutService.setType(1, 3, 'acc')).to.equal('weights');
        expect(WorkoutService.setType(3, 3, 'acc')).to.equal('weights');
        expect(WorkoutService.setType(5, 3, 'acc')).to.equal('weights');

        expect(WorkoutService.setType(1, 4, 'acc')).to.equal('weights');
        expect(WorkoutService.setType(3, 4, 'acc')).to.equal('weights');
        expect(WorkoutService.setType(5, 4, 'acc')).to.equal('weights');

        expect(WorkoutService.setType(1, 5, 'acc')).to.equal('weights');
        expect(WorkoutService.setType(3, 5, 'acc')).to.equal('weights');
        expect(WorkoutService.setType(5, 5, 'acc')).to.equal('weights');

        expect(WorkoutService.setType(1, 3, 'int')).to.equal('weights');
        expect(WorkoutService.setType(3, 3, 'int')).to.equal('weights');
        expect(WorkoutService.setType(5, 3, 'int')).to.equal('weights');

        expect(WorkoutService.setType(1, 4, 'int')).to.equal('weights');
        expect(WorkoutService.setType(3, 4, 'int')).to.equal('weights');
        expect(WorkoutService.setType(5, 4, 'int')).to.equal('weights');

        expect(WorkoutService.setType(1, 5, 'int')).to.equal('weights');
        expect(WorkoutService.setType(3, 5, 'int')).to.equal('weights');
        expect(WorkoutService.setType(5, 5, 'int')).to.equal('weights');
        
      });
    });

    context('when day is 2', () => {
      context('and training freq is 3', () => {
        it('returns rest regardless of phase', () => {
          expect(WorkoutService.setType(2, 3, 'acc')).to.equal('rest');
          expect(WorkoutService.setType(2, 3, 'int')).to.equal('rest');
          expect(WorkoutService.setType(2, 3, 'hybrid')).to.equal('rest');
          expect(WorkoutService.setType(2, 3, 'deload')).to.equal('rest');
        });
      });
    });

    context('when day is 2', () => {
      context('and training freq is 4 or 5 and phase is NOT hybrid or deload', () => {
        it('returns cardio', () => {
          expect(WorkoutService.setType(2, 4, 'acc')).to.equal('cardio');
          expect(WorkoutService.setType(2, 4, 'int')).to.equal('cardio');
          expect(WorkoutService.setType(2, 5, 'acc')).to.equal('cardio');
          expect(WorkoutService.setType(2, 5, 'int')).to.equal('cardio');
        });
      });
    });


    context('when day is 2', () => {
      context('and phase is peak', () => {
        it('returns rest regardless of training freq', () => {
          expect(WorkoutService.setType(2, 3, 'peak')).to.equal('rest');
          expect(WorkoutService.setType(2, 4, 'peak')).to.equal('rest');
          expect(WorkoutService.setType(2, 5, 'peak')).to.equal('rest');
        });
      });
    });

    context('when day is 4', () => {
      context('and training freq is 3', () => {
        it('returns rest regardless of phase', () => {
          expect(WorkoutService.setType(4, 3, 'acc')).to.equal('rest');
          expect(WorkoutService.setType(4, 3, 'int')).to.equal('rest');
          expect(WorkoutService.setType(4, 3, 'hybrid')).to.equal('rest');
          expect(WorkoutService.setType(4, 3, 'deload')).to.equal('rest');
        });
      });
    });

    context('when day is 4', () => {
      context('and training freq is 4', () => {
        it('returns rest regardless of phase', () => {
          expect(WorkoutService.setType(4, 4, 'acc')).to.equal('rest');
          expect(WorkoutService.setType(4, 4, 'int')).to.equal('rest');
          expect(WorkoutService.setType(4, 4, 'hybrid')).to.equal('rest');
          expect(WorkoutService.setType(4, 4, 'deload')).to.equal('rest');
        });
      });
    });

    context('when day is 4', () => {
      context('and training freq is 5 and phase is acc or int', () => {
        it('returns cardio', () => {
          expect(WorkoutService.setType(4, 5, 'acc')).to.equal('cardio');
          expect(WorkoutService.setType(4, 5, 'int')).to.equal('cardio');
        });
      });
    });

    context('when day is 4', () => {
      context('and phase is peak', () => {
        it('returns rest regardless of training freq', () => {
          expect(WorkoutService.setType(4, 3, 'peak')).to.equal('rest');
          expect(WorkoutService.setType(4, 4, 'peak')).to.equal('rest');
          expect(WorkoutService.setType(4, 5, 'peak')).to.equal('rest');
        });
      });
    });

    context('when day is 6 or 7', () => {
      it('returns rest regardless of phase or training freq', () => {
        expect(WorkoutService.setType(6, 3, 'acc')).to.equal('rest');
        expect(WorkoutService.setType(7, 3, 'acc')).to.equal('rest');
        expect(WorkoutService.setType(6, 3, 'int')).to.equal('rest');
        expect(WorkoutService.setType(7, 3, 'int')).to.equal('rest');
        expect(WorkoutService.setType(6, 3, 'peak')).to.equal('rest');
        expect(WorkoutService.setType(7, 3, 'deload')).to.equal('rest');

        expect(WorkoutService.setType(6, 4, 'acc')).to.equal('rest');
        expect(WorkoutService.setType(7, 4, 'acc')).to.equal('rest');
        expect(WorkoutService.setType(6, 4, 'int')).to.equal('rest');
        expect(WorkoutService.setType(7, 4, 'int')).to.equal('rest');
        expect(WorkoutService.setType(6, 4, 'peak')).to.equal('rest');
        expect(WorkoutService.setType(7, 4, 'deload')).to.equal('rest');

        expect(WorkoutService.setType(6, 5, 'acc')).to.equal('rest');
        expect(WorkoutService.setType(7, 5, 'acc')).to.equal('rest');
        expect(WorkoutService.setType(6, 5, 'int')).to.equal('rest');
        expect(WorkoutService.setType(7, 5, 'int')).to.equal('rest');
        expect(WorkoutService.setType(6, 5, 'peak')).to.equal('rest');
        expect(WorkoutService.setType(7, 5, 'deload')).to.equal('rest');
      });
    });
  });

  describe('setWeightSubTypes', () => {
    const subTypes = ['volume', 'strength', 'power'];
    it('mutates array and returns random value from available types', () => {
      const type1 = WorkoutService.setWeightsSubType(subTypes);
      expect(subTypes.length).to.equal(2);
      expect(subTypes).to.not.include(type1);
      const type2 = WorkoutService.setWeightsSubType(subTypes);
      expect(subTypes.length).to.equal(1);
      expect(subTypes).to.not.include(type2);
      const type3 = WorkoutService.setWeightsSubType(subTypes);
      expect(subTypes.length).to.equal(0);
      expect(subTypes).to.not.include(type3);
    });
  });

  describe('setCardioType', () => {
    context('when day is 4', () => {
      const subTypes = ['endurance', 'power'];
      it('always returns recovery', () => {
        const type = WorkoutService.setCardioType(subTypes, 4);
        expect(type).to.equal('recovery');
      });
    });

    context('when day is NOT 4', () => {
      it('mutates array and returns random value from available types', () => {
        const subTypes = ['endurance', 'power'];
        const type1 = WorkoutService.setWeightsSubType(subTypes, 2);
        expect(subTypes.length).to.equal(1);
        expect(subTypes).to.not.include(type1);
        const type2 = WorkoutService.setWeightsSubType(subTypes, 2);
        expect(subTypes.length).to.equal(0);
        expect(subTypes).to.not.include(type2);
      });
    });
  });

  describe('setWeekMainMovements', () => {
    context('when cycle start value is squat-press', () => {
      it('returns [squat,press] for odd weeks and [bend, pull] for even weeks', () => {
        const pair1 = WorkoutService.setWeekMainMovements('squat-press', 1);
        expect(pair1).to.eql(['squat', 'press']);
        const pair2 = WorkoutService.setWeekMainMovements('squat-press', 2);
        expect(pair2).to.eql(['bend', 'pull']);
        const pair3 = WorkoutService.setWeekMainMovements('squat-press', 3);
        expect(pair3).to.eql(['squat', 'press']);
        const pair4 = WorkoutService.setWeekMainMovements('squat-press', 4);
        expect(pair4).to.eql(['bend', 'pull']);
      });
    });

    context('when cycle start value is squat-pull', () => {
      it('returns [squat,pull] for odd weeks and [bend, press] for even weeks', () => {
        const pair1 = WorkoutService.setWeekMainMovements('squat-pull', 1);
        expect(pair1).to.eql(['squat', 'pull']);
        const pair2 = WorkoutService.setWeekMainMovements('squat-pull', 2);
        expect(pair2).to.eql(['bend', 'press']);
        const pair3 = WorkoutService.setWeekMainMovements('squat-pull', 3);
        expect(pair3).to.eql(['squat', 'pull']);
        const pair4 = WorkoutService.setWeekMainMovements('squat-pull', 4);
        expect(pair4).to.eql(['bend', 'press']);
      });
    });
  });

  describe('setPushPullPlane', () => {
    context('when pairing is [squat, pull]', () => {
      const planes = ['horizontal', 'vertical'];
      it('adds horizontal or vertical to pull', () => {
        const pair1 = WorkoutService.setPushPullPlane(['squat', 'pull'], planes);
        expect(planes.length).to.equal(1);
        const pair1plane = pair1[1].split(' ')[0];
        expect(planes).to.not.include(pair1plane);
        expect(pair1.length).to.equal(2);

        const pair2 = WorkoutService.setPushPullPlane(['squat', 'pull'], planes);
        expect(planes.length).to.equal(0);
        const pair2plane = pair2[1].split(' ')[0];
        expect(pair1plane).to.not.equal(pair2plane);
        expect(pair2.length).to.equal(2);
      });
    });

    context('when pairing is [squat, press]', () => {
      const planes = ['horizontal', 'vertical'];
      it('adds horizontal or vertical to press', () => {
        const pair1 = WorkoutService.setPushPullPlane(['squat', 'press'], planes);
        expect(planes.length).to.equal(1);
        const pair1plane = pair1[1].split(' ')[0];
        expect(planes).to.not.include(pair1plane);

        const pair2 = WorkoutService.setPushPullPlane(['squat', 'press'], planes);
        expect(planes.length).to.equal(0);
        const pair2plane = pair2[1].split(' ')[0];
        expect(pair1plane).to.not.equal(pair2plane);
      });
    });
  });

  describe('setOppositePairing', () => {
    it('returns the opposite pairing', () => {
      expect(WorkoutService.setOppositePairing(['squat', 'horizontal pull'])).to.eql(['bend', 'vertical press']);
      expect(WorkoutService.setOppositePairing(['squat', 'horizontal press'])).to.eql(['bend', 'vertical pull']);
      expect(WorkoutService.setOppositePairing(['squat', 'vertical pull'])).to.eql(['bend', 'horizontal press']);
      expect(WorkoutService.setOppositePairing(['squat', 'vertical press'])).to.eql(['bend', 'horizontal pull']);

      expect(WorkoutService.setOppositePairing(['bend', 'horizontal pull'])).to.eql(['squat', 'vertical press']);
      expect(WorkoutService.setOppositePairing(['bend', 'horizontal press'])).to.eql(['squat', 'vertical pull']);
      expect(WorkoutService.setOppositePairing(['bend', 'vertical pull'])).to.eql(['squat', 'horizontal press']);
      expect(WorkoutService.setOppositePairing(['bend', 'vertical press'])).to.eql(['squat', 'horizontal pull']);
    });
  });

  describe('setAccType', () => {
    it('mutates accTypes array and returns either carry, swing or core', () => {
      const types = ['carry', 'swing', 'core'];
      const res1 = WorkoutService.setAccType(types);
      expect(types.length).to.equal(2);
      expect(types).to.not.include(res1);
      const res2 = WorkoutService.setAccType(types);
      expect(types.length).to.equal(1);
      expect(types).to.not.include(res2);
      const res3 = WorkoutService.setAccType(types);
      expect(types.length).to.equal(0);
      expect(res3).to.not.equal(res1);
      expect(res3).to.not.equal(res2);
    });
  });

  describe('setMainReps', () => {
    const phases = ['acc', 'int'];
    const sub_types = ['volume', 'strength', 'power'];
    const main_rep_schemes = ['linear', 'cluster'];
    phases.forEach(phase => {
      context(`when phase is ${phase}`, () => {
        sub_types.forEach(sub_type => {
          context(`and sub_type is ${sub_type}`, () => {
            main_rep_schemes.forEach(main_rep_scheme => {
              context(`and main_rep_scheme is ${main_rep_scheme}`, () => {
                let workout = {phase, sub_type, main_rep_scheme};
                it('selects the correct rep scheme', () => {
                  let result = WorkoutService.setMainReps(MainTable, workout);
                  let expected = MainTable[phase][sub_type]['reps'][main_rep_scheme];
                  if (main_rep_scheme === 'linear') {
                    expect(result).to.equal(expected);
                  } else {
                    expect(expected).to.include(result);
                  }
                });
              });
            });
          });
        });
      });
    });
  });

  describe('setMainSets', () => {
    const phases = ['acc', 'int'];
    const sub_types = ['volume', 'strength', 'power'];

    phases.forEach(phase => {
      context(`when phase is ${phase}`, () => {
        sub_types.forEach(sub_type => {
          context(`when sub_type is ${sub_type}`, () => {
            let workout = {phase, sub_type};
            it('selects the correct set range', () => {
              const result = WorkoutService.setMainSets(MainTable, workout);
              const expected = MainTable[phase][sub_type]['sets'];
              expect(result).to.equal(expected);
            });
          });
        });
      });
    });
  });

  describe('setMainRest', () => {
    const phases = ['acc', 'int'];
    const sub_types = ['volume', 'strength', 'power'];

    phases.forEach(phase => {
      context(`when phase is ${phase}`, () => {
        sub_types.forEach(sub_type => {
          context(`when sub_type is ${sub_type}`, () => {
            let workout = {phase, sub_type};
            it('selects the correct rest range', () => {
              const result = WorkoutService.setMainRest(MainTable, workout);
              const expected = MainTable[phase][sub_type]['rest'];
              expect(result).to.equal(expected);
            });
          });
        });
      });
    });
  });

  const measures = ['Sets', 'Reps', 'Rest', 'Distance', 'Time'];
  measures.forEach(measure => {
    describe(`setAcc${measure}`, () => {
      let phases = ['acc', 'int'];
      phases.forEach(phase => {
        context(`when the phase is ${phase}`, () => {
          it(`it sets ${measure} properly`, () => {
            let workout = {phase};
            // eslint-disable-next-line no-eval
            let result = eval(`WorkoutService.setAcc${measure}(AccTable, workout)`);
            let expected = AccTable[phase][measure.toLowerCase()];
            expect(result).to.equal(expected);
          });
        });
      });
    });
  });

  describe('resetAvailability', () => {
    it('takes two arrays and removes all occurences of the 2nd array from the first', () => {
      const array1 = ['back squat', 'front squat', 'overhead squat', 'goblet squat'];
      const array2 = ['front squat', 'goblet squat'];
      const result = WorkoutService.resetAvailability(array1, array2);
      expect(result).to.eql(['back squat', 'overhead squat']);
    });
  });

  describe('findExercise', () => {
    const movement = 'squat';
    const sub_type = 'volume';
    let category = 'main';
    context('when doneExercises array is empty', () => {  
      it('returns a valid exercise and adds exercise to done list', async () => {  
        const doneExercises = [];
        const selectedExercise = await WorkoutService.findExercise(doneExercises, movement, category, sub_type);
        const res = await ExerciseService.find(db, movement, category, sub_type);
        const allowedExercises = res.rows.map(obj => obj.title);
        expect(allowedExercises).to.include(selectedExercise);
        expect(doneExercises).to.eql([selectedExercise]);
      });
    });

    context('when category is acc', () => {  
      it('returns a valid exercise and adds exercise to done list', async () => {
        category = 'acc';
        const doneExercises = [];
        const selectedExercise = await WorkoutService.findExercise(doneExercises, movement, category, null);
        const res = await ExerciseService.find(db, movement, category, null);
        const allowedExercises = res.rows.map(obj => obj.title);
        expect(allowedExercises).to.include(selectedExercise);
        expect(doneExercises).to.eql([selectedExercise]);
      });
    });

    context('when doneExercises contains values but they dont match the found exercise', () => {
      it('returns the found exercise and adds exercise to done list', async () => {
        const doneExercises = ['barbell glute raise', 'front plank', 'barbell power clean'];
        const selectedExercise = await WorkoutService.findExercise(doneExercises, movement, 'main', sub_type);
        const res = await ExerciseService.find(db, movement, 'main', sub_type);
        const allowedExercises = res.rows.map(obj => obj.title);
        expect(allowedExercises).to.include(selectedExercise);
        expect(doneExercises[3]).to.equal(selectedExercise);
      });
    });

    context('when doneExercises contains values that could be selected', () => {
      it('returns an available exercise and adds it to the done list', async () => {
        const doneExercises = [
          'Barbell Front Squat',
          'Barbell Overhead Squat',
          'Front Rack Barbell Lunge',
          'Barbell Back Squat',
          'Pause Barbell Back Squat'
        ];
        const selectedExercise = await WorkoutService.findExercise(doneExercises, movement, 'main', sub_type);
        expect(selectedExercise).to.equal('Pause Barbell Front Squat');
        expect(doneExercises).to.include('Pause Barbell Front Squat');
      });
    });

    context('when doneExercises contains all available exercises', () => {
      it('resets doneExercises and randomly chooses an available exercise', async () => {
        const doneExercises = [
          'Pause Barbell Front Squat',
          'Barbell Front Squat',
          'Barbell Overhead Squat',
          'Front Rack Barbell Lunge',
          'Barbell Back Squat',
          'Pause Barbell Back Squat'
        ];
        const selectedExercise = await WorkoutService.findExercise(doneExercises, movement, 'main', sub_type);
        const res = await ExerciseService.find(db, movement, 'main', sub_type);
        const allowedExercises = res.rows.map(obj => obj.title);
        expect(allowedExercises).to.include(selectedExercise);
        expect(doneExercises.length).to.equal(1);
        expect(doneExercises).to.include(selectedExercise);
      });
    });
  });

  describe('findHybridWorkout', () => {
    let doneHybridWorkouts = [];
    context('when no previously completed hybrid workouts', () => {
      it('returns a string description of a hybrid workout', async () => {
        const workout = await WorkoutService.findHybridWorkout(doneHybridWorkouts);
        expect(workout).to.be.a('string');
        expect(workout.length).to.be.above(10);
        expect(doneHybridWorkouts.length).to.equal(1);
      });
    });
  });

  describe('findCardioWorkout', () => {
    context('when given a cardio type and sub_type', () => {
      let type = 'endurance';
      let sub_type = 'mono';
      it('returns a string description of a cardio workout', async () => {
        const workout = await WorkoutService.findCardioWorkout(type, sub_type);
        expect(workout).to.be.a('string');
        expect(workout.length).to.be.above(10);
      });
    });
  });

  describe('setWorkoutWarmUp', () => {
    context('when workout type is rest', () => {
      it('returns undefined', () => {
        const type = 'rest';
        const sub_type = undefined;
        const warmUp = WorkoutService.setWorkoutWarmUp(type, sub_type);
        // eslint-disable-next-line no-unused-expressions
        expect(warmUp).to.be.undefined;
      });
    });

    context('when workout type is NOT rest', () => {
      it('returns a string warmup based on the workout type and sub_type', () => {
        const weightWarmup = WarmUpTable['weights volume'];
        const cardioWarmup = WarmUpTable['cardio endurance'];
        const cardioRecovery = WarmUpTable['cardio recovery'];
        const hybridWarmup = WarmUpTable['hybrid intensity'];

        expect(WorkoutService.setWorkoutWarmUp('weights', 'volume')).to.equal(weightWarmup);
        expect(WorkoutService.setWorkoutWarmUp('weights', 'strength')).to.equal(weightWarmup);
        expect(WorkoutService.setWorkoutWarmUp('weights', 'power')).to.equal(weightWarmup);
        expect(WorkoutService.setWorkoutWarmUp('cardio', 'endurance')).to.equal(cardioWarmup);
        expect(WorkoutService.setWorkoutWarmUp('cardio', 'power')).to.equal(cardioWarmup);
        expect(WorkoutService.setWorkoutWarmUp('cardio', 'recovery')).to.equal(cardioRecovery);
        expect(WorkoutService.setWorkoutWarmUp('hybrid', 'intensity')).to.equal(hybridWarmup);
      });
    });
  });

  describe('setWorkoutFocus', () => {
    const workouts = [
      {type: 'weights', sub_type: 'volume'},
      {type: 'weights', sub_type: 'strength'},
      {type: 'weights', sub_type: 'power'},
      {type: 'cardio', sub_type: 'endurance'},
      {type: 'cardio', sub_type: 'power'},
      {type: 'cardio', sub_type: 'recover'},
      {type: 'hybrid', sub_type: 'intensity'},
      {type: 'rest', sub_type: undefined},
    ];
    workouts.forEach(workout => {
      const {type, sub_type} = workout;
      it(`returns a string based on the workout type: ${type} and sub_type: ${sub_type}`, () => {
        let query = type === 'rest' ? 'rest': `${type} ${sub_type}`;
        expect(WorkoutService.setWorkoutFocus(type, sub_type)).to.equal(FocusTable[query]);
      });
    });
  });

  describe('createWorkouts', () => {
    it('returns an array with 84 workout objects', async () => {
      let trainingFreq = 3;
      let upperLowerPair = 'squat-press';
      let cycleId = 1;
      const workouts = await WorkoutService.createWorkouts(cycleId, trainingFreq, upperLowerPair);
      const powerDay = workouts.find(w => w.sub_type === 'power');
      const strengthDay = workouts.find(w => w.sub_type === 'strength');
      const volumeDay = workouts.find(w => w.sub_type === 'volume');
      const restDays = workouts.filter(w => w.type === 'rest' && w.week === 1);
      const hybridDay = workouts.find(w => w.type === 'hybrid');

      expect(workouts[0].cycle_id).to.equal(1);
      // eslint-disable-next-line no-unused-expressions
      expect(restDays[0].warm_up).to.be.undefined;
      // eslint-disable-next-line no-unused-expressions
      expect(restDays[0].focus).to.not.be.undefined;
  
      expect(workouts.length).to.equal(84);
      expect(powerDay.week).to.equal(1);
      expect(strengthDay.week).to.equal(1);
      expect(volumeDay.week).to.equal(1);

      expect(powerDay.main.length).to.equal(1);
      expect(strengthDay.main.length).to.equal(2);
      expect(volumeDay.main.length).to.equal(2);

      expect(powerDay.acc.length).to.be.above(1);
      expect(volumeDay.acc.length).to.be.above(1);
      expect(strengthDay.acc.length).to.be.above(1);
      
      expect(powerDay.acc.length).to.be.below(4);
      expect(volumeDay.acc.length).to.be.below(4);
      expect(strengthDay.acc.length).to.be.below(4);

      expect(restDays.length).to.equal(4);

      expect(hybridDay.main[0]).to.be.a('string');
      expect(hybridDay.main[0].length).to.be.above(10);
    });

    context('when trainingFreq is 4', () => {
      let trainingFreq = 4;
      let upperLowerPair = 'squat-press';
      let cycleId = 1;
      it('returns 8 cardio workouts', async () => {
        const workouts = await WorkoutService.createWorkouts(cycleId, trainingFreq, upperLowerPair);
        const cardioDays = workouts.filter(w => w.type === 'cardio');

        expect(cardioDays.length).to.equal(8);
        expect(cardioDays[0].main[0]).to.be.a('string');
      });
    });

    context('when trainingFreq is 5', () => {
      let trainingFreq = 5;
      let upperLowerPair = 'squat-press';
      let cycleId = 1;
      it('returns 16 cardio workouts', async () => {
        const workouts = await WorkoutService.createWorkouts(cycleId, trainingFreq, upperLowerPair);
        const cardioDays = workouts.filter(w => w.type === 'cardio');

        expect(cardioDays.length).to.equal(16);
        expect(cardioDays[0].main[0]).to.be.a('string');
      });
    });
  });

  describe('database modifying methods', () => {
    const testUsers = helpers.testUsers();
    const testCycle = {training_freq: '3', training_exp: 'beg', user_id: 1};
    beforeEach('create user, cycle and workouts', async () => {
      // assumes user_id and cycle_id is 1
      await helpers.createUsers(db, testUsers);
      await helpers.createCycle(db, testCycle);
      await helpers.createWorkouts(db, 1, 3);
    });

    afterEach('clean up tables', () => helpers.cleanTables(db));

    describe('insert', () => {
      it('saves 84 workouts per cycle', () => {
        return db('workouts')
          .where({cycle_id: 1})
          .returning('id')
          .then(rows => expect(rows.length).to.equal(84));
      });
    });

    describe('findByWeek', () => {
      it('returns all workouts for a given week', async () => {
        const cycle = await helpers.lastCreatedCycle(db);
        const week = 2;
        const workouts = await WorkoutService.findByWeek(db, cycle.id, week);
        const onlyWeek2 = workouts.filter(w => w.week === 2);
        expect(onlyWeek2.length).to.equal(7);
      });
    });

    describe('findCurrentWeek', () => {
      it('returns the current week of workouts based on what is incomplete', async () => {
        const cycle = await helpers.lastCreatedCycle(db);
        const workouts = await WorkoutService.findCurrentWeek(db, cycle.id);
        const week = workouts[0].week;
        const actual = workouts.filter(w => w.week === week);
        expect(actual.length).to.equal(7);
      });
    });
  });
  

});