'use strict';

const weightVolume = 'The goal for today is building volume. Volume training is like traditional body building where the goal is to increase the overall size of the muscle. The key to muscle gaining is to increase work capacity by lifting slightly heavier loads in less and less time. So, before increasing the weight try either increasing the reps or decreasing the amount of rest. And remember, you should never miss a rep, always leave 1-2 reps in the tank!';

const weightStrength = 'The goal for today is building strength. Strength development occurs best when ample rest is given to allow for heavier loads lifted. If you tend to short your rest, don\'t.  Importantly, even though you\'re lifting heavier loads, always leave 2-3 reps in the tank. Missing reps is a fast track to injury.';

const weightPower = 'The goal for today is building power. Power development is best achieved when you\'re able to maximally contract your muscles to quickly move a load.  Think explosiveness. Focus on high quality reps where you allow yourself plenty of rest between sets. Loading should be medium to medium-light to allow for maximum speed.';

const cardioEndurance = 'The goal for today is building cardio endurance. Endurance is built by gradually increasing how long you can continuously move. Importantly, you don\'t want to push too hard, rather stay in the 65-80% effort range to build the correct aerobic adaptations. If you\'re famililar with zone training, this is zones 2-3. Long and strong should be your mantra.';

const cardioPower = 'The goal for today is building aerobic and anaerobic power. You want to be explosive during each work set so take longer rest periods if needed to recover fully. Adopt the mindset of a sprinter and be sure to properly warm up to avoid injuries. Again, the focus is on quality, so if your interval repeats diverge too much, call it a day!';

const cardioRecovery = 'The goal for today is recovery. You should leave the session feeling better than when you started. Spend time doing manual therapy coupled with corrective movements if you\'re feeling sore or have a known weakness. Easy aerobic work helps the body recover faster as it improves blood circulation.';

const hybridIntensity = 'The goal for today is building intensity. Intensity means completing the most amount of work you can do in the shortest amount of time. These workouts are hard by design and you will be tested.  Try not to hit muscle failure at any one time as this will hinder overall intensity levels.  And remember, it\'s good to push yourself, but not to the point of injury ! If you\'re not feeling it, walk away.';

const restFocus = 'The goal for today is recovery. Focus on eating quality foods, sleeping a full 8+ hours and getting some time outside if possible. If your body is feeling well, try picking up a new sport or activity. Moving the body in novel ways is key to its longevity. If you must go into the gym, focus on exercises you don\'t regularly do.';

const FocusTable = {
  'weights volume': weightVolume,
  'weights strength': weightStrength,
  'weights power': weightPower,
  'cardio endurance': cardioEndurance,
  'cardio power': cardioPower,
  'cardio recovery': cardioRecovery,
  'hybrid intensity': hybridIntensity,
  'rest': restFocus
};

module.exports = FocusTable;