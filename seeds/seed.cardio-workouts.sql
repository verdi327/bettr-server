BEGIN;

TRUNCATE
  cardio_workouts
  RESTART IDENTITY CASCADE;

INSERT INTO cardio_workouts (tags, "desc")
VALUES
  (
    ARRAY ['mono', 'recovery'],
    'Pick a cardio movement (jog, row, bike etc)\n25-45 minutes of continuous cardio\nx 1 set @ easy pace'
  ),
  (
    ARRAY ['mixed', 'recovery'],
    'Pick two cardio movements (jog, row, bike etc)\n5 minutes of movement 1\n5 minutes of movement 2\nx 3-4 sets @ easy pace'
  ),
  (
    ARRAY ['mixed', 'recovery'],
    'Pick three cardio movements (jog, row, bike etc)\n3 minutes of movement 1\n3 minutes of movement 2\n3 minutes of movement 3\nx 3-5 sets @ easy pace'
  ),
  (
    ARRAY ['mixed', 'recovery'],
    '5 minutes of cardio (jog, row, bike etc)\n1 Rd of Animal Movements\n50ft Bear Crawl\n50ft Reverse Bear Crawl\n50ft Inch Worm\n50ft Duck Walk\n50ft Broad Jumps\nx 4-5 sets @ easy pace'
  ),
  (
    ARRAY ['mixed', 'recovery'],
    '5 minutes of cardio (jog, row, bike etc)\n1 Rd of Core Work\n10-12 Toes to Bar\n10-12 Hollow Rocks\n10-12 V-Ups\nx 4-5 sets @ easy pace'
  ),
  (
    ARRAY ['power', 'mono'],
    'Pick (running, rowing, biking)\n12-20sec Sprint (pick interval and stay with it)\nrest until recovered\nx 6-8 sets @ 100% effort'
  ),
  (
    ARRAY ['power', 'mono'],
    'Pick (running, rowing, biking)\n60sec Sprint\nrest 60sec\nx 10-12 sets @ 85-90% effort'
  ),
  (
    ARRAY ['power', 'mono'],
    'Pick (running, rowing, biking)\n90-120sec Sprint (pick interval and stay with it)\nrest 90-120sec\nx 8-10 sets @ 85-100% effort'
  ),
  (
    ARRAY ['power', 'mono'],
    'Pick (running, rowing, biking)\n2-3min of hard effort (pick interval and stay with it)\nrest 2-3 minutes\nx 6-10 sets @ 85-90% effort'
  ),		
  (
    ARRAY ['mixed', 'power'],
    'Pick (running, rowing, biking)\nPick (burpee, kb swing, jump rope)\n90sec of cardio\n30sec of accessory movement\nrest 90-120sec\nx 6-10 sets @ 85-90% effort'
  ),
  (
    ARRAY ['mixed', 'power'],
    'Pick (running, rowing, biking)\nPick (burpee, kb swing, toes to bar)\n60sec of cardio\n30sec of accessory movement\nrest 1-2 min\nx 8-10 sets @ 85-90% effort'
  ),
  (
    ARRAY ['mixed', 'power'],
    'Pick (running, rowing, biking)\nPick (Hang Power Cleans, Hang Power Snatches, Front Squat, Deadlift)\n60sec of cardio\n3-5 reps of accessory movement @ 50-65% of estimated 1RM\nrest 3-5 minutes\nx 6-8 sets @ 90-95% effort'
  ),
  (
    ARRAY ['endurance', 'mono'],
    'Pick a cardio movement (jog, row, bike etc)\n8 minutes continuous cardio\nrest 60-90sec\nx 3-4 sets @ 70-75% effort'
  ),
  (
    ARRAY ['endurance', 'mono'],
    'Pick a cardio movement (jog, row, bike etc)\n10 minutes continuous cardio\nrest 1-2 minutes\nx 2-4 sets @ 70-75% effort'
  ),
  (
    ARRAY ['endurance', 'mono'],
    'Pick a cardio movement (jog, row, bike etc)\n30-40 minutes continuous cardio\nx 1 set @ 70-75% effort'
  ),
  (
    ARRAY ['endurance', 'mixed'],
    'Pick two cardio movements (jog, row, bike etc)\n5 minutes of movement 1\n5 minutes of movement 2\nx 2-4 sets @ 70-75% effort'
  ),
  (
    ARRAY ['endurance', 'mixed'],
    'Pick a cardio movement (jog, bike, row etc)\nPick an accessory (kb swing, burpee, farmer carry)\n5 minutes of cardio movement\n10-15 reps or 300ft of accessory movement\nrest 0-90sec\nx 4-6 sets @ 70-75% effort'
  ),
  (
    ARRAY ['endurance', 'mixed'],
    'Pick a cardio movement (jog, bike, row etc)\nPick an accessory (kb swing, burpee, farmer carry)\n8 minutes of cardio movement\n15-20 reps or 300ft of accessory movement\nrest 0-2 minutes\nx 3-5 sets @ 70-75% effort'
  ),
  (
    ARRAY ['endurance', 'mixed'],
    'Complete work for given minute\nMin 1: 50sec Cardio (row/bike/jog)\nMin 2: 40sec (kb swings, burpees or jump rope)\nMin 3: 50sec Cardio Movement\nMin 4: 30sec Core Work (holds, toes to bar etc)\nx 7-10 sets @ 70-75% effort'
  );
		
COMMIT;