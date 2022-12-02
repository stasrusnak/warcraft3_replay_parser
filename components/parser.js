const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");
const fs = require("fs");


function getTime(minutes){
  let times={}
  let date = new Date();
  let currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() - minutes);
  let prevTime = ('0'+currentTime.getHours()).slice(-2)+':'+('0'+currentTime.getMinutes()).slice(-2);

  let options = {
    day: "numeric",
    year: "numeric",
    month: "short",
    hour:'2-digit',
    minute:'2-digit'

  };

  date = date.toLocaleDateString("en-BZ", options)
  date = date.replace(/ /g, '-')
  date = date.replace(/,-/g, ' ')

  times['current'] = date
  let replacement = prevTime
  let result = date.slice(0, -5) + replacement;
  times['prev'] = result

  return times
}

console.log(getTime(20))


// const d = new Date();
// const monthA = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',');
// console.log(monthA[d.getMonth()])



const getRawData = (URL) => {
  return fetch(URL)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
};


let cricketWorldCupRawData

// URL for data
const URL = "https://replays.irinabot.ru/94545/";

// start of the program
// start of the program
// const getReplays = async () => {
//     cricketWorldCupRawData = await getRawData(URL);
//
//
//   fs.writeFile("./site.html", cricketWorldCupRawData, function(err) { // записываем файл путем вызова функции writeFile(название/путь к файлу, данные, функция-коллбек)
//     if(err) { //если возникла ошибка, выводим ее в консоль
//       return console.log(err);
//     }
//
//     console.log("Done!");
//   });
//
//
// };

const path = require('path');


const file = fs.readFileSync(path.resolve(__dirname, './../src/site/site.html')).toString();

// console.log(file)

const links = file.match(/<a href="(.*?)">.*?LegionTD_x20_-prссah.*?<\/a>/gm);


let linkBase = []
links.forEach(i=>{

  let link = i.match(/"(.*?)"/g);
  let re = link[0].replace(/"/g, '')
  re = decodeURIComponent(re)
  linkBase.push(re)

  // let parsLink =  re.match(/GHost\+\+_(.*?)_LegionTD_x20_-prссah_\+(.*?)_\((.*?)\).w3g/m);

console.log(parsLink[1])
console.log(parsLink[2])
console.log(parsLink[3])
  // linkBase.push(parsLink)

})

  fs.writeFile("./../src/links/old.json", JSON.stringify(linkBase), function(err) {
    if(err) { //если возникла ошибка, выводим ее в консоль
      return console.log(err);
    }
    console.log("links save");
  });



console.log(linkBase)


// invoking the main function
// getReplays();

