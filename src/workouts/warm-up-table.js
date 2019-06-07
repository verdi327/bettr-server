'use strict';

const weightWarmup = 'Spend at least 10 minutes to warm up properly. Start with myofacial work (foam roller, lax ball etc.) followed by light calistenics or animal flow movements. You should break a slight sweat. Finally, do a few sets building in weight of the movements you will be completing in the main workout block.';

const cardioWarmup = 'Start with myofacial work (foam roller, lax ball etc.) followed by light calistenics or animal flow movements. Then, pick a cardio movement and spend 5-10 minutes gradually increasing your heart rate. Ideally, your heart rate should touch the rate you\'ll hit during your work set.' ;

const cardioRecovery = 'Start with myofacial work (foam roller, lax ball etc.) followed by light calistenics or animal flow movements. Then, complete 1-3 corrective exercises that target a known weakness - like your shoulders, hips, knees etc.';

const hybridWarmup = 'Higher intensity work requires a longer warmup.  Spend 15-20 minutes to ensure readiness. Start with myofacial work (foam roller, lax ball etc.) followed by light calistenics or animal flow movements. Finally, do 1-2 practice rounds of the movements in the main block building in weight.';



const WarmUpTable = {
  'weights volume': weightWarmup,
  'weights strength': weightWarmup,
  'weights power': weightWarmup,
  'cardio endurance': cardioWarmup,
  'cardio power': cardioWarmup,
  'cardio recovery': cardioRecovery,
  'hybrid intensity': hybridWarmup,
};

module.exports = WarmUpTable;

