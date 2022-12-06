const mongoose = require('mongoose');
const config = require('../config.json')
const path = require('path');
const fs = require("fs");
const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));

const ReplayParser = require("@kokomi/w3g-parser").default
const ActionParser = require("@kokomi/w3g-parser").ActionParser;

const Maps = require('../models/map.model');
const links = require('../models/links.model');
const User = require('../models/user.model');

const compositeOpponent = require('glicko2-composite-opponent');
const glicko2 = require('glicko2');

const settings = {
  // tau : "Reasonable choices are between 0.3 and 1.2, though the system should
  //      be tested to decide which value results in greatest predictive accuracy."
  tau: 0.5,
  // rating : default rating
  rating: 1000,
  //rd : Default rating deviation
  //     small number = good confidence on the rating accuracy
  rd: 155,
  //vol : Default volatility (expected fluctation on the player rating)
  vol: 0.06
};
var ranking = new glicko2.Glicko2(settings);
var pc = ranking.makePlayer()
var matches = [];

// let state = {};

let state = {
  "playerToName": {
    "0": "-HakypuJlo-",
    "1": "putch93",
    "2": "Zer0id228",
    "3": "humorist8",
    "4": "YooMaYoo",
  },
  "leavers": {
    "2": true
  },
  "flags": {
    "0": "loser",
    "1": "loser",
    "2": "loser",
    "3": "loser",
    "4": "winner",
  }
}


mongoose.connect(config.mongo_url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    console.log("connect");
    setTimeout(async () => {
      let link = await links.find({idrep: 595});
      console.log(link)

      let li = link[0]


      if (li.pars === 1) {
        //find players
        let players = [];
        for (let key in state.playerToName) {
          let user = await User.findOne({nick: state.playerToName[key]});
          if (!user) {
            let user = new User({
              nick: state.playerToName[key],
              PTS: 1000,
              prevPTS: 1000,
              Games: 0,
              wins: 0,
              lose: 0,
              leavers: 0,
              idrep: 0,
            })
            user.save().then(() => {
              console.log(state.playerToName[key] + ' create')
            })
            players.push(user)
          } else {
            players.push(user)
          }
        }

        function getPlayers(nick) {
          let pts = []
          Object.keys(players).forEach((key) => {
            if (players[key].nick === nick) pts = players[key]
          })
          return pts
        }

        function setPts() {
          let pts = []
          Object.keys(players).forEach((key) => {
            if (players[key].nick === nick) pts = players[key].PTS
          })
          return pts
        }


        //calc pts
        let wt = []
        let lt = []
        let winner = []
        let loser = []

        for (let key in state.playerToName) {
          switch (state.flags[key]) {
            case "winner" :
              let plw = getPlayers(state.playerToName[key])
              console.log(plw)
              winner.push({
                'nick':plw.nick,
                'PTS':plw.PTS
              })
              wt.push(ranking.makePlayer(plw.PTS, 155, 0.05))
              break
            case "loser" :
              let pll = getPlayers(state.playerToName[key])
              loser.push({
                'nick':pll.nick,
                'PTS':pll.PTS
              })
              lt.push(ranking.makePlayer(pll.PTS, 155, 0.05))
              break
          }
        }


        // team wt defeats team lt
        let matches = compositeOpponent(wt, lt, 1);
        ranking.updateRatings(matches);


        console.log(players)
        console.log(winner)
        console.log(loser)

        //Доделать карты

        wt[0] ?  console.log(winner[0].nick +'|'+Math.round(wt[0].getRating()) + '|'+winner[0].PTS )  : 1
        wt[1] ?  console.log(winner[1].nick +'|'+Math.round(wt[1].getRating()) + '|'+winner[1].PTS )  : 1
        wt[2] ?  console.log(winner[2].nick +'|'+Math.round(wt[2].getRating()) + '|'+winner[2].PTS )  : 1
        wt[3] ?  console.log(winner[3].nick +'|'+Math.round(wt[3].getRating()) + '|'+winner[3].PTS )  : 1

        lt[0] ?  console.log(loser[0].nick +'|'+Math.round(lt[0].getRating()) + '|'+loser[0].PTS )  : 1
        lt[1] ?  console.log(loser[1].nick +'|'+Math.round(lt[1].getRating()) + '|'+loser[1].PTS )  : 1
        lt[2] ?  console.log(loser[2].nick +'|'+Math.round(lt[2].getRating()) + '|'+loser[2].PTS )  : 1
        lt[3] ?  console.log(loser[3].nick +'|'+Math.round(lt[3].getRating()) + '|'+loser[3].PTS )  : 1



        /*
        getReplays('https://replays.irinabot.ru/94545/' + li.link).then(async () => {



          // Object.keys(state.playerToName).forEach((key,index) => {
          //
          //   console.log(state.playerToName[key])
          //   user['nick'] = state.playerToName[key]
          //   user['index'] = index
          //   let pla = ranking.makePlayer();
          //
          //   if (state.flags){
          //     switch (state.flags[key]) {
          //       case "loser" :
          //         user['loser'] = 1
          //         user['prevPTS']= parseInt(pla.getRating())
          //         matches.push([pla, pc, 0]);
          //         ranking.updateRatings(matches);
          //         user['PTS'] = parseInt(pla.getRating())
          //         break
          //       case "winner" :
          //         user['winner'] = 1
          //         user['prevPTS']= parseInt(pla.getRating())
          //         matches.push([pla, pc, 1]);
          //         ranking.updateRatings(matches);
          //         user['PTS'] = parseInt(pla.getRating())
          //         break
          //     }
          //   }
          //   if(state.leavers) {
          //     user['leaver']
          //   }
          //
          //   user['Games']={idrep: li.idrep,
          //                   'PTS': user['PTS'] ? user['PTS'] : pla.getRating(),
          //                   'prevPTS' : user['prevPTS'] ? user['prevPTS'] : pla.getRating()}
          //   console.log(user)
          //
          // });


          //
          // const user = new User({
          //   nick: state.playerToName[key],
          //   PTS: {},
          //   Games: {},
          //   winRate: {},
          //   wins: {},
          //   lose: {},
          //   date_insert: {},
          //   idrep: {},
          // })


          // let data = {
          //   idrep: li.idrep,
          //   pars: 1,
          //   players: state.playerToName,
          //   leavers: state.leavers,
          //   flags: state.flags,
          // }

          // const map = new Maps(data)
          // map.save()
          //   .then(()=>{
          //     li.pars = 1
          //     li.save()
          //   })
          console.log("save new map data : " );

        })

        */
      }


      // link.forEach(li => {
      //   if (li.pars === 1) {
      //     getReplays('https://replays.irinabot.ru/94545/' + li.link).then(() => {
      //
      //
      //       console.log(JSON.stringify(state))
      //
      //       // let user = {}
      //       //
      //       // console.log(state.playerToName.length)
      //       //
      //       // Object.keys(state.playerToName).forEach((key,index) => {
      //       //
      //       //   console.log(state.playerToName[key])
      //       //   user['nick'] = state.playerToName[key]
      //       //   user['index'] = index
      //       //   let pla = ranking.makePlayer();
      //       //
      //       //   if (state.flags){
      //       //     switch (state.flags[key]) {
      //       //       case "loser" :
      //       //         user['loser'] = 1
      //       //         user['prevPTS']= parseInt(pla.getRating())
      //       //         matches.push([pla, pc, 0]);
      //       //         ranking.updateRatings(matches);
      //       //         user['PTS'] = parseInt(pla.getRating())
      //       //         break
      //       //       case "winner" :
      //       //         user['winner'] = 1
      //       //         user['prevPTS']= parseInt(pla.getRating())
      //       //         matches.push([pla, pc, 1]);
      //       //         ranking.updateRatings(matches);
      //       //         user['PTS'] = parseInt(pla.getRating())
      //       //         break
      //       //     }
      //       //   }
      //       //   if(state.leavers) {
      //       //     user['leaver']
      //       //   }
      //       //
      //       //   user['Games']={idrep: li.idrep,
      //       //                   'PTS': user['PTS'] ? user['PTS'] : pla.getRating(),
      //       //                   'prevPTS' : user['prevPTS'] ? user['prevPTS'] : pla.getRating()}
      //       //   console.log(user)
      //
      //       // });
      //
      //
      //       //
      //       // const user = new User({
      //       //   nick: state.playerToName[key],
      //       //   PTS: {},
      //       //   Games: {},
      //       //   winRate: {},
      //       //   wins: {},
      //       //   lose: {},
      //       //   date_insert: {},
      //       //   idrep: {},
      //       // })
      //
      //
      //       // let data = {
      //       //   idrep: li.idrep,
      //       //   pars: 1,
      //       //   players: state.playerToName,
      //       //   leavers: state.leavers,
      //       //   flags: state.flags,
      //       // }
      //
      //       // const map = new Maps(data)
      //       // map.save()
      //       //   .then(()=>{
      //       //     li.pars = 1
      //       //     li.save()
      //       //   })
      //       console.log("save new map data : " + data.idrep);
      //
      //     })
      //   }
      // })

    }, 1000);
  })
  .catch(error => console.log('mongodb connected error! :' + error))


const getRawData = (URL) => {
  return fetch(URL)
    .then((res) => res.arrayBuffer())
    .then((data) => {
      return data;
    })
    .catch(function (err) {
      console.log(err)
    });
};


// URL for data
// const URL = "https://replays.irinabot.ru/94545/GHost++_2022-12-04_00-05_Legion_TD_x20_-prccah_+591_(45m52s).w3g";

const getReplays = async (URL) => {
  // let file = await getRawData(URL);
  const file = fs.readFileSync(path.resolve(__dirname, '../src/2222.w3g'));


  getStats(file)
};

function getStats(file) {

  let asuna = new ReplayParser();
  const data = asuna.parseReplay(file);
  const aParser = new ActionParser();
  let actions = []
  let tokens = []


  function tokenizeKey(key) {
    const tokens = [];
    let token = "";
    let escaping = false;

    for (let i = 0; i < key.length; ++i) {
      if (escaping) {
        if (key[i] === " ") token += " ";
        else if (key[i] === "\\") token += "\\";
        else token += key[i];

        escaping = false;
      } else {
        if (key[i] === " ") {
          if (token.length === 0)
            throw new Error(
              "Error tokenizing key [" + key + "], empty token found."
            );

          tokens.push(token);
          token = "";
        } else if (key[i] === "\\") escaping = true;
        else token += key[i];
      }
    }

    if (token.length === 0) {
      throw new Error("Error tokenizing key [" + key + "], empty token found.");
    }

    tokens.push(token);

    return tokens;
  }

  data.records.actions.forEach((i, k) => {

    const result = aParser.processActionData(i.rawData);
    actions.push({
      commandBlocks: result,
      time: i.time,
      seqenceNumber: k,
    });


  });

  actions.forEach((i) => {

    i.commandBlocks.forEach((j) => {

      if (
        j.actions.length > 0 &&
        // @ts-ignore
        j.actions[0].filename === "MMD.Dat"
      ) {

        j.actions.forEach((y) => {

          if (y.missionKey) {
            if (y.missionKey.startsWith("val:")) {
              tokens = tokenizeKey(y.key);


              if (tokens[0] === "init" && tokens[1] === "pid") {
                const pid = parseInt(tokens[2]);

                if (isNaN(pid)) return;

                state = {
                  ...state,
                  playerToName: {
                    ...state.playerToName,
                    [pid]: tokens[3],
                  },
                };
              } else if (tokens[0] === "FlagP") {
                const PID = parseInt(tokens[1]);

                switch (tokens[2]) {
                  case "leaver":
                    state = {
                      ...state,
                      leavers: {...state.leavers, [PID]: true},
                    };
                    break;
                  case "practicing":
                    state = {
                      ...state,
                      practicing: {...state.practicing, [PID]: true},
                    };
                    break;
                  case "winner":
                    state = {
                      ...state,
                      flags: {...state.flags, [PID]: "winner"},
                    };
                    break;
                  case "loser":
                    state = {
                      ...state,
                      flags: {...state.flags, [PID]: "loser"},
                    };
                    break;
                  case "drawer":
                    state = {
                      ...this.state,
                      flags: {...state.flags, [PID]: "drawer"},
                    };
                    break;
                  default:
                    break;
                }

              }
            }
          }
        })
      }
    })
  })

}


/**********

 var compositeOpponent = require('glicko2-composite-opponent');


 getReplays('https://replays.irinabot.ru/94545/').then(() => {

  for (let key in state.playerToName) {
    let user = new User({
      nick: state.playerToName[key],
      PTS: 1000,
      Games: 0,
      wins: 0,
      lose: 0,
      leavers: 0,
      date_insert: {},
      idrep: {},
    })

    console.log(user)
  }




  let vt = []
  let lt = []


  for (let key in state.playerToName) {
    switch (state.flags[key]) {
      case "winner" :
        console.log(state.playerToName[key])
        vt.push(ranking.makePlayer(1400, 155, 0.05))
        break
      case "loser" :
        console.log(state.playerToName[key])
        lt.push(ranking.makePlayer(1100, 155, 0.05))
        break
    }
  }

  // team vt defeats team lt
  let matches = compositeOpponent(vt, lt, 1);
  ranking.updateRatings(matches);


  console.log(lt[0].getRating())
  console.log(lt[1].getRating())
  console.log(lt[2].getRating())
  console.log(lt[3].getRating())

  console.log(vt[0].getRating())
  console.log(vt[1].getRating())
  console.log(vt[2].getRating())
  console.log(vt[3].getRating())

 *************/

/*
  for (let key in state.playerToName) {


    user['nick'] = state.playerToName[key]
    console.log(key)
    console.log(state.playerToName[key])
    var pla = ranking.makePlayer();

    if (state.flags){
      switch (state.flags[key]) {
        case "loser" :
          user['loser'] = 1
          user['prevPTS']= parseInt(pla.getRating())
          matches.push([pla, pc, 0]);
          ranking.updateRatings(matches);
          user['PTS'] = parseInt(pla.getRating())
          break
        case "winner" :
          user['winner'] = 1
          user['prevPTS']= parseInt(pla.getRating())
          matches.push([pla, pc, 1]);
          ranking.updateRatings(matches);
          user['PTS'] = parseInt(pla.getRating())
          break
      }
    }else{
      user['rmk'] = 1
      user['prevPTS'] = parseInt(pla.getRating())
      user['PTS'] = parseInt(pla.getRating())
    }
    if(state.leavers[key]) {
      user['leaver'] = 1
    }
    user['Games']={idrep: 597,
      'PTS': user['PTS'] ? user['PTS'] : pla.getRating(),
      'prevPTS' : user['prevPTS'] ? user['prevPTS'] : pla.getRating()}
    console.log(user)
    user=[]
    pla = []
    ranking = []
    matches = []

  }
*/

// Object.keys(state.playerToName).forEach((key,index) => {
//

//
// });


// let user = {}
//
// console.log(state.playerToName.length)
//
// Object.keys(state.playerToName).forEach((key,index) => {
//
//   console.log(state.playerToName[key])
//   user['nick'] = state.playerToName[key]
//   user['index'] = index
//   let pla = ranking.makePlayer();
//
//   if (state.flags){
//     switch (state.flags[key]) {
//       case "loser" :
//         user['loser'] = 1
//         user['prevPTS']= parseInt(pla.getRating())
//         matches.push([pla, pc, 0]);
//         ranking.updateRatings(matches);
//         user['PTS'] = parseInt(pla.getRating())
//         break
//       case "winner" :
//         user['winner'] = 1
//         user['prevPTS']= parseInt(pla.getRating())
//         matches.push([pla, pc, 1]);
//         ranking.updateRatings(matches);
//         user['PTS'] = parseInt(pla.getRating())
//         break
//     }
//   }
//   if(state.leavers) {
//     user['leaver']
//   }
//
//   user['Games']={idrep: li.idrep,
//                   'PTS': user['PTS'] ? user['PTS'] : pla.getRating(),
//                   'prevPTS' : user['prevPTS'] ? user['prevPTS'] : pla.getRating()}
//   console.log(user)

// });


//
// const user = new User({
//   nick: state.playerToName[key],
//   PTS: {},
//   Games: {},
//   winRate: {},
//   wins: {},
//   lose: {},
//   date_insert: {},
//   idrep: {},
// })


// let data = {
//   idrep: li.idrep,
//   pars: 1,
//   players: state.playerToName,
//   leavers: state.leavers,
//   flags: state.flags,
// }

// const map = new Maps(data)
// map.save()
//   .then(()=>{
//     li.pars = 1
//     li.save()
//   })
//   console.log("save new map data : ");
//
// })
