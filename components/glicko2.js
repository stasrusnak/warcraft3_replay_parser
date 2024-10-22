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
 // Выше настроки стандарные
  tau:   0.5,
  rating: 1200,
  rd:   250,
  vol:  0.055,
  //Тут я поправил немного дефольные настройки, чтоб так много не минусовало
};



//---------------------------------------
// Пример игры 4-4 с разными рейтингами
// Количетво игроков можно изменять.
// "rd" это отклонение рейтинга при победе или поражении
// играя с этим параметром можно настроить оптимальное отклонение
//---------------------------------------
var r = new glicko2.Glicko2(settings);
var a = [
  r.makePlayer( 1700,350),
  r.makePlayer(1600,350),
  r.makePlayer(1600,350),
  r.makePlayer(1600,350),
];
var b = [
  r.makePlayer(	1500,	1500*settings.vol),
  r.makePlayer(1500,1500*settings.vol),
  r.makePlayer(1500,1500*settings.vol),
  r.makePlayer(1500,1500*settings.vol),
];

// команда А побеждает команду Б
var matches = compositeOpponent(a,b, 1);

r.updateRatings(matches);

// Результат
console.log(-1700+a[0].getRating() )
console.log(-1600+a[1].getRating())
console.log(-1600+a[2].getRating())
console.log(-1600+a[3].getRating())

console.log('------------------')
console.log(-1500+b[0].getRating())
console.log(-1500+b[1].getRating())
console.log(-1500+b[2].getRating())
console.log(-1500+b[3].getRating())




var r = new glicko2.Glicko2(settings);
var a = [
  r.makePlayer(1000,300),
];
var b = [
  r.makePlayer(1000,42),
];
