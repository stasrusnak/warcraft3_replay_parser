var glicko2 = require('glicko2');

var settings = {
  // tau : "Reasonable choices are between 0.3 and 1.2, though the system should
  //      be tested to decide which value results in greatest predictive accuracy."
  tau : 0.5,
  // rating : default rating
  rating : 1500,
  //rd : Default rating deviation
  //     small number = good confidence on the rating accuracy
  rd : 200,
  //vol : Default volatility (expected fluctation on the player rating)
  vol : 0.06
};
var ranking = new glicko2.Glicko2(settings);

// Create players
var Ryan = ranking.makePlayer(1000);
var pc = ranking.makePlayer(1000)

var matches = [];



matches.push([Ryan, pc, 1]);
ranking.updateRatings(matches);

console.log("Ryan new rating: " + Ryan.getRating());
console.log("Ryan new rating: " + pc.getRating());


