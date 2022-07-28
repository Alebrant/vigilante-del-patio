// index.js

/**
 * Required External Modules
 */
 const tmi = require('tmi.js');
 
 /**
  * App Variables
  */
require("dotenv").config();
const tmiClient = new tmi.Client({
    channels: [process.env.CHANNEL],
    identity:{
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_TOKEN
    }
});
  
 /**
  *  App Configuration
  */
require("dotenv").config();

/**
 * Chat listener initiation
 */

tmiClient.connect();

tmiClient.on('message', (chann, tags, message, self) => {
    let pattern = /!tobogan.*/i,
        matches = message.match(pattern),
        timeout = parseInt(process.env.TIMEOUT),
        zascaVerbose = process.env.SAY;
    if(matches){
        let mozunidad = Math.random()*100,
            mozo = tags.username;
        if(mozunidad<34){
            if(zascaVerbose){
                tmiClient.say(chann, `Oh nooooo @${mozo} ha bajado de boca y se nos ha lesionado, tira para la enfermeria un rato`);
            }
            if(timeout){
                tmiClient.timeout(chann, mozo, timeout, "Accidente en el tobogán")
                    .then(res => {console.log("Timed out")})
                    .catch(err => {console.log("error", err)})
            }
        } else if(mozunidad>65){
            if(zascaVerbose){
                tmiClient.say(chann, `Yujuuuuuuuu @${mozo} ha bajado y aterrizado con una voltereta`)
            }
        } else {
            if(zascaVerbose){
                tmiClient.say(chann, `Aiiiiiii que esto esta pegajoso y no resbala @${mozo} ha bajado a paso tortuga`)
            }
        }
        if(!zascaVerbose && !zascaHabilitado){
            console.log(`${tags['display-name']} dice: "${message}"`)
        }
    } else if(message=="!echo"){
        tmiClient.say(chann, "echooo");
    } else {
        console.log(`${tags['display-name']} dice: "${message}"`)
    }
});
