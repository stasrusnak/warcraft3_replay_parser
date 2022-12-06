var compositeOpponent = require('glicko2-composite-opponent');
var glicko2 = require('glicko2');


var settings = {
  // tau : "Reasonable choices are between 0.3 and 1.2, though the system should
  //      be tested to decide which value results in greatest predictive accuracy."
  tau : 0.5,
  // rating : default rating
  rating : 1000,
  //rd : Default rating deviation
  //     small number = good confidence on the rating accuracy
  rd : 155,
  //vol : Default volatility (expected fluctation on the player rating)
  vol : 0.06
};

var r = new glicko2.Glicko2(settings);
var a = [
  r.makePlayer(1100, 155),
  r.makePlayer(1800, 155)
];
var b = [
  r.makePlayer(1400, 155)
];

// team A defeats team B
var matches = compositeOpponent(b,a, 1);


r.updateRatings(matches);

console.log(a[0].getRating())
console.log(a[1].getRating())
console.log(b[0].getRating())
