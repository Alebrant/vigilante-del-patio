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
    let pattern = /(\w+)\s+es\s+un\s+(\d+)% /,
        matches = message.match(pattern),
        timeout = parseInt(process.env.TIMEOUT),
        zascaVerbose = process.env.SAY;
    if(matches){
        let mozunidad = parseInt(matches[2]),
            mozo = matches[1];
        if(mozunidad<40){
            if(zascaVerbose){
                tmiClient.say(chann, `ZASCA para @${mozo}`);
            }
            if(timeout){
                tmiClient.timeout(chann, mozo, timeout, "Poco mozo")
                    .then(res => {console.log("Timed out")})
                    .catch(err => {console.log("error", err)})
            }
        }
        if(mozunidad>=40){
            if(zascaVerbose){
                tmiClient.say(chann, `@${mozo} tiene buena mozunidad`)
            }
        }
        if(!zascaVerbose && !zascaHabilitado){
            console.log(`${tags['display-name']} dice: "${message}"`)
        }
    } else {
        console.log(`${tags['display-name']} dice: "${message}"`)
    }
});
