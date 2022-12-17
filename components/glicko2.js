var compositeOpponent = require('glicko2-composite-opponent');
var glicko2 = require('glicko2');


var settings = {
  // // tau : "Reasonable choices are between 0.3 and 1.2, though the system should
  // //      be tested to decide which value results in greatest predictive accuracy."
  // tau : 0.3,
  // // rating : default rating
  // rating : 1000,
  // //rd : Default rating deviation
  // //     small number = good confidence on the rating accuracy
  // rd :  30,
  // //vol : Default volatility (expected fluctation on the player rating)
  // vol : 0.06

  tau:   0.5,
  rating: 1000,
  rd:   250,
  vol:  0.09,

};

var r = new glicko2.Glicko2(settings);
var a = [
  r.makePlayer(1000,300),
];
var b = [
  r.makePlayer(1000,42),
];

// team A defeats team B
var matches = compositeOpponent(a,b, 1);


r.updateRatings(matches);





console.log(a[0].getRating())
// console.log(a[1].getRating())
console.log(b[0].getRating())
// console.log(b[1].getRating())




// var r = new glicko2.Glicko2(settings);
// var a = [
//   r.makePlayer(1000,300),
// ];
// var b = [
//   r.makePlayer(1000,42),
// ];
