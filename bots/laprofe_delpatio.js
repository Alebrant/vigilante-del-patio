// index.js

/**
 * Required External Modules
 */
 const tmi = require('tmi.js');
 
 /**
  * App Variables
  */
require("dotenv").config();
const profeDelPatio = new tmi.Client({
    channels: [process.env.CHANNEL],
    identity:{
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_TOKEN
    }
});
let columpio = {
    ocupadoPor: null,
    desde: null,
    timeout: null
};
  
 /**
  *  App Configuration
  */
require("dotenv").config();

/**
 * Chat listener initiation
 */

profeDelPatio.connect();
profeDelPatio.on('message', (chann, tags, message, self) => {
    let toboganPattern = /!tobogan.*/i,
        toboganMatches = message.match(toboganPattern),
        columpioPattern = /!columpio.*/i,
        columpioMatches = message.match(columpioPattern),
        timeoutTobogan = parseInt(process.env.TIMEOUT),
        timeoutColumpio = parseInt(15),
        zascaVerbose = process.env.SAY,
        mozo = tags.username;
    if(toboganMatches){
        let mozunidad = Math.random();
        if(mozunidad<1/3){
            if(zascaVerbose){
                profeDelPatio.say(chann, `Oh nooooo @${mozo} ha bajado de boca y se nos ha lesionado, tira para la enfermeria un rato`);
            }
            if(timeoutTobogan){
                profeDelPatio.timeout(chann, mozo, timeoutTobogan, "Accidente en el tobogán")
                    .then(res => {console.log("Timed out")})
                    .catch(err => {console.log("error", err)})
            }
        } else if(mozunidad>=2/3){
            if(zascaVerbose){
                profeDelPatio.say(chann, `Yujuuuuuuuu @${mozo} ha bajado y aterrizado con una voltereta`)
            }
        } else {
            if(zascaVerbose){
                profeDelPatio.say(chann, `Aiiiiiii que esto esta pegajoso y no resbala @${mozo} ha bajado a paso tortuga`)
            }
        }
        if(!zascaVerbose && !timeoutTobogan){
            console.log(`${tags['display-name']} dice: "${message}"`)
        }
    } else if(columpioMatches){
        if(mozo == columpio.ocupadoPor){
            return profeDelPatio.say(chann, `@${mozo} Lleva un rato montado en el columpio.`);
        }
        if(columpio.ocupadoPor){
            let mensaje = `@${mozo} tira a @${columpio.ocupadoPor} del columpio para subirse.`;
            if(timeoutColumpio){
                mensaje = `${mensaje} @${columpio.ocupadoPor} se ha espiñado. Toca viaje a la enfermería.`;
                profeDelPatio.timeout(chann, columpio.ocupadoPor, timeoutColumpio, "Accidente en el columpio")
                    .then(res => {console.log("Timed out")})
                    .catch(err => {console.log("error", err)})
            }
            profeDelPatio.say(chann, mensaje);
        }
        columpio.ocupadoPor = mozo;
        columpio.desde = new Date();
        profeDelPatio.say(chann, `@${mozo} se sube al columpio. Wiiii`);
    } else if(message=="!echo"){
        profeDelPatio.say(chann, "echooo");
    } else if(tags['display-name'] != process.env.ADMIN_USER){
        console.log(`${tags['display-name']} dice: "${message}"`)
    }
    return;
});
