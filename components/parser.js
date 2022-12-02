const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");
const fs = require("fs");

const mysql = require("mysql");
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

  let parsLink =  re.match(/GHost\+\+_(.*?)_LegionTD_x20_-prссah_\+(.*?)_\((.*?)\).w3g/m);


  // console.log(parsLink[0])
  // console.log(parsLink[1])
  // console.log(parsLink[2])

  parsLink[3] = parsLink[3].replace(/m/g, ':')
  parsLink[3] = parsLink[3].replace(/s/g, '')


  // console.log(parsLink[3])


  linkBase.push(
    {
      'date':parsLink[1],
      'time':parsLink[3],
      'idrep':parsLink[2],
      'link':parsLink[0]
    })

})

// console.log(linkBase)
// console.log(linkBase.length)
//
// ('John', 123, 'Lloyds Office')

let string = '';
// linkBase.forEach(item => string += `('${item.date}', '${item.time}', ${item.idrep}, '${item.link}'),`);


// linkBase.forEach(item => {
//
//   string= `('${item.date}', '${item.time}', ${item.idrep}, '${item.link}'),`
//
//   string = string.slice(0, -1)
//
//   let query = `INSERT INTO REPS (date, time, idrep, link)
//                      VALUES` + string+`;`;
//
//
//
//
//   console.log(query)
//
//
//   // connection.query(query, function (err, result) {
//   //   // if any error while executing above query, throw error
//   //   if (err) throw err;
//   //   // if there is no error, you have the result
//   //   console.log(result);
//   // });
//
// });



const connection = mysql.createConnection({
  host: "database-1.c0rbzmgklnqg.eu-central-1.rds.amazonaws.com",
  user: "admin",
  password: "00250025",
  database: "stats"
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected successfully to MySql server")
});


linkBase.forEach(item => {

  string= `('${item.date}', '${item.time}', ${item.idrep}, '${item.link}'),`

  string = string.slice(0, -1)

  let query = `INSERT INTO REPS (date, time, idrep, link)
                     VALUES` + string+`;`;




  console.log(query)

  setTimeout(function() {
    connection.query(query, function (err, result) {
      // if any error while executing above query, throw error
      if (err) throw err;
      // if there is no error, you have the result
      console.log(result);
    });
  }, 140);


});

// let date = '2022-05-30_00-23'
// let time = '47m47s'
// let idrep = '4'
// let link = 'GHost++_2022-05-30_00-23_LegionTD_x20_-prссah_+4_(47m47s).w3g'
//
//
// // date = date.replace(/_/g, ' ')

// string = string.slice(0, -1)
//
// let query = `INSERT INTO REPS (date, time, idrep, link)
//                      VALUES` + string+';';
//
// let query = `INSERT INTO REPS (date, time, idrep, link)
//                      VALUES` +`('2022-05-30_00-03', '40:19', 1, 'GHost++_2022-05-30_00-03_LegionTD_x20_-prссah_+1_(40m19s).w3g'),('2022-05-30_00-16', '48:49', 3, 'GHost++_2022-05-30_00-16_LegionTD_x20_-prссah_+3_(48m49s).w3g'),('2022-05-30_00-23', '47:47', 4, 'GHost++_2022-05-30_00-23_LegionTD_x20_-prссah_+4_(47m47s).w3g');`
//
//
// console.log(query)

//
// connection.query(query, function (err, result) {
//   // if any error while executing above query, throw error
//   if (err) throw err;
//   // if there is no error, you have the result
//   console.log(result);
// });



// INSERT INTO MyTable
  // ( Column1, Column2, Column3 )
  // VALUES
// ('John', 123, 'Lloyds Office'),
//   ('Jane', 124, 'Lloyds Office'),
//   ('Billy', 125, 'London Office'),
//   ('Miranda', 126, 'Bristol Office');


  // fs.writeFile("./../src/links/old.json", JSON.stringify(linkBase), function(err) {
  //   if(err) { //если возникла ошибка, выводим ее в консоль
  //     return console.log(err);
  //   }
  //   console.log("links save");
  // });
  //


// console.log(linkBase)


// invoking the main function
// getReplays();

