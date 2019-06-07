'use strict';

const MainTable = {
  acc: {
    volume: {
      reps: {
        linear: '10-12',
        cluster: [
          '2-3-5-10',
          '3-5-8',
          '3-5-2-8'
        ] 
      },
      sets: '3-4',
      rest: '1-2 minutes'
    },
    strength: {
      reps: {
        linear: '6-8',
        cluster: [
          '2-3-5',
          '2-2-2',
          '2-4-2'
        ]
      },
      sets: '3-5',
      rest: '2-4 minutes'
    },
    power: {
      reps: {
        linear: '1-3',
        cluster: [
          '1-1-1',
          '1-2-1'
        ]
      },
      sets: '7-10',
      rest: 'as needed'
    }
  },
  int: {
    volume: {
      reps: {
        linear: '8-10',
        cluster: [
          '2-3-5-8',
          '2-4-6',
          '2-4-2-5'
        ]
      },
      sets: '3-4',
      rest: '1-2 minutes'
    },
    strength: {
      reps: {
        linear: '4-6',
        cluster: [
          '2-3-4',
          '2-2-2',
          '2-3-2'
        ]
      },
      sets: '3-5',
      rest: '2-4 minutes'
    },
    power: {
      reps: {
        linear: '1-3',
        cluster: [
          '1-1-1',
          '1-2-1'
        ]
      },
      sets: '7-10',
      rest: 'as needed'
    }
  }
};

module.exports = MainTable;