BEGIN;

TRUNCATE
  hybrid_workouts
  RESTART IDENTITY CASCADE;

INSERT INTO hybrid_workouts (difficulty, "desc")
VALUES
  (
    'adv',
    'For Time:\nRow 1000m\n25 Barbell Thrusters (95/65)\nRow 1000m'
  ),
  (
    'adv',
    'AMRAP in 10 minutes:\n5 Push Jerks (115/75 lbs)\n10 Deadlifts (115/75 lbs)\n15 Box jumps'
  ),
  (
    'adv',
    'AMRAP in 12 minutes:\n20 Wall balls (20/14 lbs)\n50 Double-unders\n3 Muscle-ups'
  ),
  (
    'adv',
    'AMRAP in 20 minutes:\n5 Pronated Pull-Ups\n10 Push-Ups\n15 Air Squats\n20 calorie Row'
  ),
  (
    'adv',
    'AMRAP in 20 minutes:\n5 Pronated Pull-Ups\n7 Handstand Push-Ups\n20 Air Squats'
  ),
  (
    'adv',
    '3 Rounds For Time:\n400m Run\n21 Kettlebell Swings (53/35 lbs)\n12 Pronated Pull-Ups'
  ),
  (
    'adv',
    '3 Rounds For Time:\n500m Row\n12 Deadlifts (bodyweight)\n21 Box Jumps (24/20 in)'
  ),
  (
    'adv',
    '5 Rounds For Max Reps:\nBarbell Bench Press (bodyweight)\nPronated Pull-Ups\nRest 2 minutes'
  ),
  (
    'adv',
    '5 Rounds For Time:\n12 Jumping Push-Ups\n12 Jumping Squats\n200m Run'
  ),
  (
    'adv',
    'For Time:\n21-15-9\nBarbell Thruster (95/65 lbs)\nPronated Pull-Up'
  ),
  (
    'adv',
    'For Time:\n21-15-9\nClean Grip Deadlifts (225/155 lbs)\nHandstand Push-Ups'
  ),
  (
    'adv',
    'For Time:\n21-15-9\nSquat Cleans (135/95 lbs)\nRing Dips'
  ),
  (
    'adv',
    '3 Rounds For Time:\n15 Bench Press (3/4 bodyweight)\n20 Single Arm Dumbbell Rows (40/20 lbs)\n1000m Row'
  ),
  (
    'adv',
    '3 Rounds For Time:\nRow 1000m\n20 Burpees over the rower'
  ),
  (
    'adv',
    'AMRAP in 20 minutes:\n3 Pronated Pull-Ups\n6 Push-Ups\n9 Air Squats\n6 Pronated Pull-Ups\n12 Push-Ups\n18 Air Squats\n12 Pronated Pull-Ups\n24 Push-Ups\n36 Air Squats\n24 Pronated Pull-Ups\n48 Push-Ups\n72 Air Squats'
  ),
  (
    'adv',
    '3 Rounds For Time:\n15 Power Snatches (95/65 lbs)\n15 Thrusters (95/65 lbs)'
  ),
  (
    'adv',
    'Within 30 minutes\n3 rep max, Back Squat\n3 rep max, Strict Press\n3 rep max, Deadlift'
  ),
  (
    'adv',
    '3 Rounds For Time:\n7 Muscle-ups\n50 squats\n1000 meter row'
  ),
  (
    'adv',
    'For Time:\n1,000 Meter Row\n\nDirectly Into…\n\n3 Rounds:\n12 Deadlifts (135/95 lbs)\n17 Lateral Barbell Burpees\n7 Push Jerks (135/95 lbs)'
  ),
  (
    'adv',
    'AMRAP in 18 minutes\n12/9 Calorie Assault Bike\n15 Wallballs (20/14)\n12 Alternating Dumbbell Snatches (50/35)\n9 Toes to Bar'
  ),
  (
    'adv',
    'Front Squat\nBuild to a heavy set of 5\n\nrest as needed, then:\n\nFor Time:\n80 Double Unders, 30 Sit-ups, 200 Meter Run\n60 Double Unders, 25 Sit-ups, 200 Meter Run\n40 Double Unders, 20 Sit-ups, 200 Meter Run\n20 Double Unders, 15 Sit-ups, 200 Meter Run\n10 Double Unders, 10 Sit-ups, 200 Meter Run'
  ),
  (
    'adv',
    'AMRAP in 18 minutes\n20 Deadlifts (135/95)\n10 Pull-Ups\n20/15 Calorie Assault Bike\n10 Jumping Push-Ups'
  ),
  (
    'adv',
    'For Time:\n24-20-16-12:\nCalorie Assault Bike\nAlternating Dumbbell Snatches (50/35)\nCalorie Assault Bike\nDumbbell Goblet Front Squats (50/35)'
  ),
  (
    'adv',
    '6 Rounds for Total Reps in 23 minutes\n1:00 Calorie Row\n1:00 Burpees\n1:00 Double Unders\n1:00 Rest'
  ),
  (
    'adv',
    'Push Press\nBuild to a heavy set of 3\n\nrest as needed, then complete:\n\n3 Rounds For Time:\n15 Hang Power Cleans (95/65)\n15 Front Squats (95/65)\n15 Push Press (95/65)'
  ),
  (
    'adv',
    'Bench Press\nBuild to a heavy set of 3\n\nrest as needed, then complete:\n\n50 Calorie Assault Bike\n10 Power CJ (135/95), 20 Toes to Bar\n10 Power CJ (135/95), 15 Strict Pull Ups\n10 Power CJ (135/95), 10 Muscle Ups\n50 Calories Assault Bike'
  ),
  (
    'adv',
    'On the Minute x 20 (4 Rounds):\nMinute 1 - 5 Pausing Overhead Squats (115/80)\nMinute 2 - 15/12 Calorie Row\nMinute 3 - 10 Alternating Dumbbell Snatches (50/35)\nMinute 4 - 5 Toes to Bar + 5 Handstand Push-Ups\nMinute 5 - 12/9 Calorie Assault Bike'
  ),
  (
    'adv',
    'Power Clean\nBuild to a Heavy Complex:\n1 Hang Power Clean\n1 Power Clean\n1 Front Squat\n\nrest as needed, then complete:\n\n5 Rounds:\n30 Double Unders\n5 Power Cleans (135/95)\n7 Burpees over the bar'
  ),
  (
    'adv',
    'Back Squat\nBuild to a heavy set of 4\n\nrest as needed, then complete:\n\nFor Time:\n15 Kettlebell Swings (70/53), 15 Box Jump Overs, 3 Rope Climbs\n12 Kettlebell Swings (70/53), 15 Box Jump Overs, 3 Rope Climbs\n9 Kettlebell Swings (70/53), 15 Box Jump Overs, 3 Rope Climbs\n6 Kettlebell Swings (70/53), 15 Box Jump Overs, 3 Rope Climbs'
  ),
  (
    'adv',
    '5 Supersets:\n5-4-3-2-1: Heavy Deadlifts\n\nAfter Each Set:\n10 Dumbbell Bench Press\n15 Weighted AbMat Sit-ups\n\nrest as needed, then complete:\n\nAMRAP in 15 minutes:\n60 Double Unders\n30/21 Calorie Bike\n10 Push Jerks (135/95)'
  ),
  (
    'adv',
    'AMRAP in 18 minutes:\n6 Power Cleans (135/95)\nMax Unbroken Set: Strict Handstand Push-ups\n6 Front Squats (135/95)\nMax Unbroken Set: Pull-Ups'
  ),
  (
    'adv',
    'Weighted Pull-Up\nBuild to a heavy set of 3\n\nrest as needed, then complete:\n\n3 Rounds for time:\n10 Dumbbell Lunges (50/35 lbs)\n12 Toes to Bar\n400m Run'
  ),
  (
    'adv',
    'AMRAP in 20 minutes:\n12 Front Squats (95/65)\n14 Box Jumps (24/20)\n16 Toes to Bar\n30/21 Calorie Row'
  ),
  (
    'adv',
    'Tempo Back Squat\n4 Sets of 2\n5 Second Negative, 3 Second Pause in Bottom, Explode Up\n\nrest as needed, then complete:\n\n3 Rounds for Time:\n12 Dumbbell Push Press\n20 Jumping Lunges\n25 Sit Ups'
  ),
  (
    'adv',
    'AMRAP in 15 minutes:\n50 Double Unders\n5 Hang Power Cleans (155/105)\nRun 400m\n5 Muscle-ups'
  ),
  (
    'adv',
    '5 Rounds, Not For Time:\nMax Set Strict Pull-Ups\nrest 2 minutes\nMax Set Strict Press (1/2 Bodyweight)\nrest 2 minutes\nMax Set Front Squats (Bodyweight)\nrest 2 minutes'
  ),
  (
    'adv',
    'For Time:\n50/30 Calorie Bike\n\nDirectly Into...\n\n3 Rounds:\n20 Toes To Bar\n20 Push-Ups\n\nDirectly Into...\n\n50/30 Calorie Bike'
  ),
  (
    'adv',
    'AMRAP in 20 minutes:\n50/40 Calorie Row\n40 Wallballs (20/14)\n30 Toes to Bar\n20 Burpees\n50/40 Calorie Row'
  ),
  (
    'adv',
    'Back Squat\nBuild to a heavy set of 10\n\nrest as needed, then complete:\n\nFor Time:\n1-2-3-4-5-6-7-8-9-10\nDumbbell Front Squats (50/35)\nBurpee over Dumbbell'
  );

COMMIT;