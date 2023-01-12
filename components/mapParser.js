const mongoose = require('mongoose');
const config = require('../config.json')
const path = require('path');
const fs = require("fs");
const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));

const ReplayParser = require("@kokomi/w3g-parser").default
const ActionParser = require("@kokomi/w3g-parser").ActionParser;

const maps = require('../models/map.model');
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
  rd: 250,
  //vol : Default volatility (expected fluctation on the player rating)
  vol: 0.09,

};
var ranking = new glicko2.Glicko2(settings);
var pc = ranking.makePlayer()
var matches = [];

let state = {};

// let state = {
//   "playerToName": {
//     "0": "-HakypuJlo-",
//     "1": "putch93",
//     "2": "Zer0id228",
//     "3": "humorist8",
//     "4": "YooMaYoo",
//     "5": "romanuk2020",
//     "6": "BetterThatYou",
//     "7": "Alaster"
//   }
// }

const wait = ms => new Promise(res => setTimeout(res, ms))



mongoose.connect(config.mongo_url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(async () => {
    console.log("connect");
       asparsMapSetStats()

  })
  .catch(error => console.log('mongodb connected error! :' + error))





async function asparsMapSetStats(){


  do{


    let link = await maps.find({pars: 0});


    for (const l of link) {

      let li = l
      console.log(l.link)
      state = await getReplays('https://replays.irinabot.ru/94545/'+l.link)

    // let li = 1

      console.log(state)

      if (li && state) {
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
              rmk: 0,
              leavers: 0,
              idreps: []
            })
            await user.save()
              .then(() => {
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

        let wt = []
        let lt = []
        let winner = []
        let loser = []
        let leavers = []
        let rmk = []

        for (let key in state.playerToName) {

          if (state.flags) {
            switch (state.flags[key]) {
              case "winner" :
                let plw = getPlayers(state.playerToName[key])
                console.log(plw)
                winner.push({
                  'nick': plw.nick,
                  'PTS': 0,
                  'prevPTS': plw.PTS
                })
                wt.push(ranking.makePlayer(plw.PTS, 300))
                break
              case "loser" :
                let pll = getPlayers(state.playerToName[key])
                console.log(pll)
                loser.push({
                  'nick': pll.nick,
                  'PTS': 0,
                  'prevPTS': pll.PTS
                })
                lt.push(ranking.makePlayer(pll.PTS, 42))
                break
            }
          }else {
            let plrmk = getPlayers(state.playerToName[key])
            rmk.push({
              'nick': plrmk.nick,
              'PTS': plrmk.PTS,
              'prevPTS': plrmk.PTS
            })
          }
        }

        if (state.flags) {
          let matches = compositeOpponent(wt, lt, 1);
          ranking.updateRatings(matches);
          console.log('winners')
          wt[0] ? winner[0].PTS = Math.round(wt[0].getRating()) : 1
          wt[1] ? winner[1].PTS = Math.round(wt[1].getRating()) : 1
          wt[2] ? winner[2].PTS = Math.round(wt[2].getRating()) : 1
          wt[3] ? winner[3].PTS = Math.round(wt[3].getRating()) : 1
          console.log('losers')
          lt[0] ? loser[0].PTS = Math.round(lt[0].getRating()) : 1
          lt[1] ? loser[1].PTS = Math.round(lt[1].getRating()) : 1
          lt[2] ? loser[2].PTS = Math.round(lt[2].getRating()) : 1
          lt[3] ? loser[3].PTS = Math.round(lt[3].getRating()) : 1

          for (let key in state.leavers) {
            leavers.push(state.playerToName[key])
          }


          for (const w of [...winner]) {
            let pl = getPlayers(w.nick)
            pl.PTS = w.PTS
            pl.prevPTS = w.prevPTS
            pl.Games = pl.Games + 1
            pl.wins = pl.wins + 1
            !pl.idreps.includes(li._id) ? pl.idreps = [...pl.idreps, li._id] : 1
            leavers.includes(w.nick) ? pl.leavers = pl.leavers + 1 : 1
            await pl.save()
          }

          for (const l of [...loser]) {
            let pl = getPlayers(l.nick)
            pl.PTS = l.PTS
            pl.prevPTS = l.prevPTS
            pl.Games = pl.Games + 1

            if(leavers.includes(l.nick) ){
              pl.leavers = pl.leavers + 1
            }else {
              pl.lose = pl.lose + 1
            }

            !pl.idreps.includes(li._id) ? pl.idreps = [...pl.idreps, li._id] : 1
            await pl.save()
          }
        }else {
          for (const l of [...rmk]) {
            let pl = getPlayers(l.nick)
            pl.PTS = l.PTS
            pl.prevPTS = l.PTS
            pl.Games = pl.Games + 1
            pl.rmk = pl.rmk + 1
            !pl.idreps.includes(li._id) ? pl.idreps = [...pl.idreps, li._id] : 1
            await pl.save()
          }
        }


        let data = {
          idrep: li.idrep,
          link: l.link,
          pars: 1,
          winners: winner,
          losers: loser,
          leavers: leavers,
          rmk: rmk,
          flags: state.flags,
        }

        await maps.findOneAndUpdate(
          {_id: li._id},
          { $set: data }
        ).then(async () => {
          console.log("save new map data : ");
        })


      }

      await wait(2000)
    }

    console.log('New task')
    await wait(2000)

  }while (1)


  return true
}





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
  let file = await getRawData(URL);
  // const file = fs.readFileSync(path.resolve(__dirname, '../src/rmk.w3g'));


  return getStats(file)
};

function getStats(file) {
  let state = {};
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

  return state
}


