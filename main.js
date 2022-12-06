const path = require('path');
const fs = require("fs");

const ReplayParser = require("@kokomi/w3g-parser").default
const ActionParser = require("@kokomi/w3g-parser").ActionParser;

const file = fs.readFileSync(path.resolve(__dirname, './src/2222.w3g'));


let asuna = new ReplayParser();
const data = asuna.parseReplay(file);
const aParser = new ActionParser();
let actions =[]
let tokens =[]
let state = {};

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
    ){

      j.actions.forEach((y) => {

        if (y.missionKey){
          if (y.missionKey.startsWith("val:")) {
            tokens =  tokenizeKey(y.key);


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



fs.writeFile("./output.json", JSON.stringify(state), function(err) { // записываем файл путем вызова функции writeFile(название/путь к файлу, данные, функция-коллбек)
  if(err) { //если возникла ошибка, выводим ее в консоль
    return console.log(err);
  }

  console.log("Done!");
});

debugger;
