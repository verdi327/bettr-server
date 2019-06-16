'use strict';
const { DB_URL } = require('../config');
const MainTable = require('./main-table');
const AccTable = require('./acc-table');
const WarmUpTable = require('./warm-up-table');
const FocusTable = require('./focus-table');
const ExerciseService = require('../exercises/exercise-service');
const HybridWorkoutService = require('../hybrid-workouts/hyrbid-workout-service');
const CardioWorkoutService = require('../../src/cardio-workouts/cardio-workout-service');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: DB_URL,
});

const WorkoutService = {
  setPhase(week) {
    let phase;
    if (week <= 4) {
      phase = 'acc';
    } else if (week > 4 && week <= 8) {
      phase = 'int';
    } else if (week > 8 && week <= 11) {
      phase = 'peak';
    } else {
      phase = 'deload';
    }
    return phase;
  },

  setType(day, trainingFreq, phase) {
    if (phase === 'deload') {
      return 'rest';
    } else if (phase === 'peak' && [2,4].includes(day)) {
      return 'rest';
    } else if ([1,3,5].includes(day) && (phase === 'acc' || phase === 'int')) {
      return 'weights';
    } else if ([1,3,5].includes(day) && phase === 'peak') {
      return 'hybrid';
    } else if (day === 2 && trainingFreq === 3) {
      return  'rest';
    } else if (day === 2 && trainingFreq !== 3) {
      return 'cardio';
    } else if (day === 4 && trainingFreq !== 5 ) {
      return 'rest';
    } else if (day === 4 && trainingFreq === 5) {
      return 'cardio';
    } else {
      return 'rest';
    }
  },

  randomPop(array){
    return this.shuffle(array).pop();
  },

  setWeightsSubType(availableTypes) {
    return this.randomPop(availableTypes);
  },

  setCardioType(phase, day) {
    if (day === 4) {
      return 'recovery';
    } else if (phase === 'acc') {
      return 'endurance';
    } else {
      return 'power';
    }
  },

  setCardioSubType(availableTypes) {
    return this.randomPop(availableTypes);
  },

  setWeekMainMovements(upperLowerPair, week) {
    if (upperLowerPair === 'squat-press' && week%2 === 1) {
      return ['squat', 'press'];
    } else if (upperLowerPair === 'squat-press' && week%2 === 0) {
      return ['bend', 'pull'];
    } else if (upperLowerPair === 'squat-pull' && week%2 === 1) {
      return ['squat', 'pull'];
    } else if (upperLowerPair === 'squat-pull' && week%2 === 0) {
      return ['bend', 'press'];
    }
  },

  setPushPullPlane(pairing, pushPullTypes) {
    const clone = [...pairing];
    const movementPlane = this.randomPop(pushPullTypes);
    const updatedPlane = `${movementPlane} ${clone[1]}`;
    clone[1] = updatedPlane;
    return clone;
  },

  oppositeTable() {
    return {
      'squat': 'bend',
      'bend': 'squat',
      'horizontal press': 'vertical pull',
      'horizontal pull': 'vertical press',
      'vertical pull': 'horizontal press',
      'vertical press': 'horizontal pull'
    };
  },

  setOppositePairing(pair) {
    const [movement1, movement2] = pair;
    return [
      this.oppositeTable()[movement1],
      this.oppositeTable()[movement2]
    ];
  },

  setAccType(availableTypes) {
    return this.randomPop(availableTypes);
  },

  setMainRepScheme(availableTypes) {
    return this.shuffle(availableTypes)[0];
  },

  setMainReps(table, workout) {
    const {phase, sub_type, main_rep_scheme} = workout;
    let result = table[phase][sub_type]['reps'][main_rep_scheme];
    if (main_rep_scheme === 'cluster') {
      result = this.shuffle(result)[0];
    }
    return result;
  },

  setMainSets(table, workout) {
    const {phase, sub_type} = workout;
    return table[phase][sub_type]['sets'];
  },

  setMainRest(table, workout) {
    const {phase, sub_type} = workout;
    return table[phase][sub_type]['rest'];
  },

  setAccReps(table, workout) {
    const {phase} = workout;
    return table[phase]['reps'];
  },

  setAccSets(table, workout) {
    const {phase} = workout;
    return table[phase]['sets'];
  },

  setAccRest(table, workout) {
    const {phase} = workout;
    return table[phase]['rest'];
  },

  setAccDistance(table, workout) {
    const {phase} = workout;
    return table[phase]['distance'];
  },

  setAccTime(table, workout) {
    const {phase} = workout;
    return table[phase]['time'];
  },

  setWorkoutCompletion(type) {
    return type === 'rest' ? true : false;
  },

  async findExercise(doneExercises, movement, category, sub_type) {
    const res = await ExerciseService.find(db, movement, category, sub_type);
    const exercises = res.rows.map(row => row.title);
    for (let i=0; i<exercises.length; i++) {
      let exercise = exercises[i];
      if (!doneExercises.includes(exercise)) {
        doneExercises.push(exercise);
        return exercise;
      }
    }
    // func didn't return which means all available exercises have been completed
    // need to reset their availability by removing them from the doneExercises list
    this.resetAvailability(doneExercises, exercises);
    
    // exercises are already shuffled, just return first one in array
    const selectedExercise = exercises[0];

    // now add the selected exercise to the doneExercise list
    doneExercises.push(selectedExercise);

    return selectedExercise;
  },

  async findHybridWorkout(doneHybridWorkouts) {
    const workouts = await HybridWorkoutService.find(db);
    for (let i=0; i<workouts.length; i++) {
      let workout = workouts[i];
      if (!doneHybridWorkouts.includes(workout.id)) {
        doneHybridWorkouts.push(workout.id);
        return workout.desc;
      }
    }
  },

  async findMainPowerExercise(doneExercises) {
    const res = await ExerciseService.findMainPower(db);
    const exercises = res.rows.map(row => row.title);

    for (let i=0; i<exercises.length; i++) {
      let exercise = exercises[i];
      if (!doneExercises.includes(exercise)) {
        doneExercises.push(exercise);
        return exercise;
      }
    }
    // func didn't return which means all available exercises have been completed
    // need to reset their availability by removing them from the doneExercises list
    this.resetAvailability(doneExercises, exercises);
    
    // exercises are already shuffled, just return first one in array
    const selectedExercise = exercises[0];

    // now add the selected exercise to the doneExercise list
    doneExercises.push(selectedExercise);

    return selectedExercise;
  },

  async findCardioWorkout(type, sub_type) {
    // type: endurance, power, recover
    // sub_type: mono or mixed

    const res = await CardioWorkoutService.find(db, type, sub_type);
    const workouts = res.rows.map(w => w.desc);
    return workouts[0];
  },

  setWorkoutWarmUp(type, sub_type) {
    // type: weight, cardio, hybrid, rest
    // sub_type: volume, strength, power, endurance, etc...

    if (!sub_type) {
      return;
    }
    return WarmUpTable[`${type} ${sub_type}`];
  },

  setWorkoutFocus(type, sub_type) {
    if (type === 'rest') {
      return FocusTable['rest'];
    } 

    return FocusTable[`${type} ${sub_type}`];
  },
  
  // trainingFreq: can be int 3,4,5
  // upperLowerPair: can be 'squat-pull' or 'squat-press'
  async createWorkouts(cycle_id, trainingFreq, upperLowerPair='squat-pull') {
    trainingFreq = Number(trainingFreq);
    const workouts = [];
    const doneExercises = [];
    const doneHybridWorkouts = [];
    for (let week=1; week <=12; week++) {
      const phase = this.setPhase(week);
      let weightSubTypes = ['volume', 'strength', 'power'];
      let cardioSubTypes = ['mono', 'mixed'];
      let accTypes = ['carry', 'swing', 'core'];
      let mainRepSchemes = ['linear', 'cluster'];
      let weekMainMovements = this.setWeekMainMovements(upperLowerPair, week);
      
      for (let day=1; day <=7; day++) {
        let workout = {};
        let pushPullTypes = ['horizontal', 'vertical'];
        workout.cycle_id = cycle_id;
        workout.phase = phase;
        workout.week = week;
        workout.day = day;
        workout.type = this.setType(day, trainingFreq, phase);

        if (workout.type === 'weights') {
          workout.sub_type = this.setWeightsSubType(weightSubTypes);
          //power days will use compound movements for acc work
          if (workout.sub_type === 'power') {
            workout.acc_movements = ['compound'];
          } else {
            // power workouts don't care about movement pair b/c just chooses from 1 main
            // updating push/pull main movements to include horizontal or vertical
            workout.main_movements = this.setPushPullPlane(weekMainMovements, pushPullTypes);
            workout.acc_movements = this.setOppositePairing(workout.main_movements);
          }
          // update acc_movements to include carry/swing/core
          // workout.acc_movements = [...workout.acc_movements, this.setAccType(accTypes)];
          workout.acc_movements.push(this.setAccType(accTypes));
          
          // setting rep_scheme, reps, sets and rest for MAIN
          workout.main_rep_scheme = this.setMainRepScheme(mainRepSchemes);
          workout.main_reps = this.setMainReps(MainTable, workout);
          workout.main_sets = this.setMainSets(MainTable, workout);
          workout.main_rest = this.setMainRest(MainTable, workout);

          // setting reps, sets and rest for ACC
          workout.acc_reps = this.setAccReps(AccTable, workout);
          workout.acc_sets = this.setAccSets(AccTable, workout);
          workout.acc_rest = this.setAccRest(AccTable, workout);
          // these measures are dependent on particular exercises being selected
          // but, added them and we don't need to use them if the exercises dont call for it
          workout.acc_distance = this.setAccDistance(AccTable, workout);
          workout.acc_time = this.setAccTime(AccTable, workout);

          workout.main = [];
          workout.acc = [];

          // power days dont have main_movements, they simply look up exercises that are tagged as 'power' and 'main'
          if (workout.sub_type === 'power') {
            const exercise = await this.findMainPowerExercise(doneExercises);
            workout.main.push(exercise);
          } else {
            workout.main_movements.forEach(async movement => {
              const exercise = await this.findExercise(doneExercises, movement, 'main', workout.sub_type);  
              workout.main.push(exercise);
            });
          }

          workout.acc_movements.forEach(async movement => {
            const exercise = await this.findExercise(doneExercises, movement, 'acc', null);
            workout.acc.push(exercise);
          });


        } else if (workout.type === 'cardio') {
          workout.sub_type = this.setCardioType(phase, day);
          const cardioSubType = this.setCardioSubType(cardioSubTypes);
          const workoutDetails = await this.findCardioWorkout(workout.sub_type, cardioSubType);
          workout.main = [workoutDetails];
        } else if (workout.type === 'hybrid') {
          workout.sub_type = 'intensity';
          const workoutDetails = await this.findHybridWorkout(doneHybridWorkouts);
          workout.main = [workoutDetails];
        }

        workout.completed = this.setWorkoutCompletion(workout.type);
        workout.warm_up = this.setWorkoutWarmUp(workout.type, workout.sub_type);
        workout.focus = this.setWorkoutFocus(workout.type, workout.sub_type);
        workouts.push(workout);  
      }
    }
    return workouts;
  },

  shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  },

  resetAvailability(doneExercises, exercises) {
    exercises.forEach(exercise => {
      let foundIndex = doneExercises.findIndex(value => value === exercise);
      if (foundIndex !== -1) {
        doneExercises.splice(foundIndex, 1);
      }
    });
    return doneExercises;
  },

  insert(knex, workouts) {
    return knex('workouts')
      .insert(workouts)
      .returning('*')
      .then(rows => rows);
  },

  findByWeek(knex, cycle_id, week) {
    week = Number(week);
    return knex('workouts')
      .where({cycle_id, week})
      .select(['id', 'day', 'week', 'phase', 'type', 'sub_type', 'completed', 'cycle_id'])
      .orderBy('day')
      .then(rows => rows);
  },

  async findCurrentWeek(knex, cycle_id) {
    const workouts = await knex('workouts').where({cycle_id, completed: false}).orderBy('week').select('*');
    const week = workouts[0].week;
    
    return this.findByWeek(knex, cycle_id, week);
  },

  findCurrentWorkout(knex, cycle_id) {
    return knex('workouts')
      .where({cycle_id, completed: false})
      .orderBy('week')
      .orderBy('day')
      .limit(1)
      .first('*');
  },

  findById(knex, id) {
    return knex('workouts').where({id}).first('*');
  },

  updateWorkout(knex, id, updates) {
    return knex('workouts')
      .where({id})
      .update(updates);
  }
};

module.exports = WorkoutService;