const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const path = require('path');
const config = require('../config.json')
const mongoose = require('mongoose');

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

let datePars = '2022-12-17'


const wait = ms => new Promise(res => setTimeout(res, ms))
//
// async function load () { // We need to wrap the loop into an async function for this to work
//     await timer(3000); // then the created Promise can be awaited
// }
//
// load();

mongoose.connect(config.mongo_url, {
  useUnifiedTopology: true,
  useNewUrlParser: true

})
  .then(async () => {
    console.log('mongodb connected!')

   if(getReplays()){
     let linkBase = getLinks(datePars)
     const Links = require('../models/links.model');

     for (const item of linkBase) {

       console.log(item)
       let  resp = await Links.findOne({ idrep: item.idrep });
       if (!resp) {
         const link = new Links(item)
         await link.save()
         console.log("save new rep link :"+ item.idrep);
       }
       await wait(500);
     }
     console.log("done save links");
   }
  })
  .catch(error => console.log('mongodb connected error! :' + error))





const getRawData = (URL) => {
  return fetch(URL)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
};


let body

// URL for data
const URL = "https://replays.irinabot.ru/94545/";


const getReplays = async () => {
    body = await getRawData(URL);
    fs.writeFile(path.resolve(__dirname,'../src/site/site.html'), body, function(err) { // записываем файл путем вызова функции writeFile(название/путь к файлу, данные, функция-коллбек)
      if(err) { //если возникла ошибка, выводим ее в консоль
        return console.log(err);
      }
      console.log("getReplays Done!");
      return true
    });

};





function getLinks(datePars){
  const file = fs.readFileSync(path.resolve(__dirname,'../src/site/site.html')).toString();

  if (file){
    const links = file.match(/GHost(.*?x20.*?\.)w3g/gm);
    let linkBase = []
    links.forEach(i=>{
      let re = decodeURIComponent(i)
      let mapdate =  re.match(/GHost\+\+_(.*?)_/m);
      if ( new Date(mapdate[1]) >= new Date(datePars)) {
        let parsLink =  re.match(/GHost\+\+_(.*?)_Legion_TD_x20_-prccah_\+(.*?)_\((.*?)\)\.w3g/m);
        if(parsLink){
          parsLink[3] = parsLink[3].replace(/m/g, ':')
          parsLink[3] = parsLink[3].replace(/s/g, '')
          linkBase.push(
            {
              'date':parsLink[1],
              'time':parsLink[3],
              'idrep':parsLink[2],
              'link':parsLink[0]
            })
        }
      }
    })
    console.log("getLinks Done!");
    return linkBase
  }

}


