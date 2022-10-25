// index.js

/**
 * Required External Modules
 */
 const tmi = require('tmi.js');
 const axios = require('axios');
 /**
  * App Variables
  */
require("dotenv").config();
const adee = new tmi.Client({
    channels: ['tnarbela'],
    identity:{
        username: process.env.USER2,
        password: process.env.TOKEN2
    }
});
const tna = new tmi.Client({
    channels: ['tnarbela'],
    identity:{
        username: process.env.USER3,
        password: process.env.TOKEN3
    }
});
let datosRecompensas = {
    broadcaster_id: null,
    recompensas: null
};

 /**
  *  App Configuration
  */
require("dotenv").config();
let recompensas = [];
/**
 * Chat listener initiation
 */

adee.connect();
tna.connect();
adee.on('message', (chann, tags, message, self) => {
    let oniPattern = /!oni.*/i,
        oniMatches = message.match(oniPattern),
        hkPattern = /!hk.*/i,
        hkMatches = message.match(hkPattern),
        recompensasComunes = ['Proponer recompensa'],
        hablante = tags.username;
    if(oniMatches){
        let recompensasOni = [],
            bgColor = "#064B00",
            recompensasActivas = recompensasComunes.concat(recompensasOni);
        datosRecompensas.recompensas.forEach(recompensa => {
            let id = recompensa.id,
                activa = recompensasActivas.includes(recompensa.title) || recompensa.background_color == bgColor,
                actualizar = activa != recompensa.is_enabled;
            if(actualizar){
                updateReward(id, activa);
            }
        });
    } else if(hkMatches){
        let recompensasHK = ['¡Cuenta conmigo!_dup'],
            bgColor = "#646464",
            recompensasActivas = recompensasComunes.concat(recompensasHK);
        datosRecompensas.recompensas.forEach(recompensa => {
            let id = recompensa.id,
                activa = recompensasActivas.includes(recompensa.title) || recompensa.background_color == bgColor,
                actualizar = activa != recompensa.is_enabled;
            if(actualizar){
                updateReward(id, activa);
            }
        });
    } else if(message=="!auth"){
        authorize();
    } else if(message=="!token"){
        getToken();
    } else if(message=="!reinit"){
        initRecompensas();
    } else if(message=="!echo"){
        setTimeout(function(){
            tna.say(chann, "echooo");
        }, 100);
    } else if(tags['display-name'] != process.env.ADMIN_USER){
        console.log(`${tags['display-name']} dice: "${message}"`)
    }
    return;
});
function authorize(){
    let urlAuthorize = "https://id.twitch.tv/oauth2/authorize",
        redirect = encodeURIComponent(process.env.ALEB_REDIRECT_URL),
        response_type = 'code',
        scopesArr = ['channel:manage:redemptions'],
        scope = encodeURIComponent(scopesArr.join('+')),
        url = `${urlAuthorize}?client_id=${process.env.ALEB_CLIENT}&redirect_uri=${redirect}`
            + `&response_type=${response_type}&scope=${scope}`;
    console.log(url);
}

function getToken(){
    let urlToken = "https://id.twitch.tv/oauth2/token",
        redirect = process.env.ALEB_REDIRECT_URL,
        data = {
            client_id: process.env.ALEB_CLIENT,
            client_secret: process.env.ALEB_SECRET,
            code: process.env.ALEB_CODE,
            grant_type: 'authorization_code',
            redirect_uri: redirect
        };
        token = process.env.ALEB_TOKEN;
    console.log("data", data);
    axios.post(urlToken, data)
    .then(response => {
        token = response.data.access_token,
        console.log("api response: ", response);
    }).catch(e => {
        console.log("error", e.response.data);
    })
}
function initRecompensas(){
    axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.ALEB_TOKEN}`;
    axios.defaults.headers.common['Client-Id'] = process.env.ALEB_CLIENT;
    const urlUsuarios = 'https://api.twitch.tv/helix/users',
        urlRewards = 'https://api.twitch.tv/helix/channel_points/custom_rewards';
    axios.get(urlUsuarios)
    .then(getUsersResponse => {
        return getUsersResponse.data.data[0];
    }).then(user => {
        datosRecompensas.broadcaster_id = user.id; 
        let url = `${urlRewards}?broadcaster_id=${user.id}`;
        return axios.get(url);
    }).then(rewardsResponse => {
        let recompensas = rewardsResponse.data.data;
        datosRecompensas.recompensas = recompensas;
    }).catch(e => {
        console.log("error", e.response);
    })
}

function updateReward(id, activate){
    const urlUpdateReward = 'https://api.twitch.tv/helix/channel_points/custom_rewards',
        url = `${urlUpdateReward}?broadcaster_id=${datosRecompensas.broadcaster_id}&id=${id}`,
        data = {
            is_enabled: !!activate
        };
    console.log("Actualizar", id, activate);

    axios.patch(url, data)
    .then(response => {
        let nuevaRecompensa = response.data.data[0];
        console.log(response.data);
        datosRecompensas.recompensas.forEach(recompensa => {
            if(nuevaRecompensa.id == recompensa.id){
                recompensa.is_enabled = nuevaRecompensa.is_enabled;
            }
        });
    }).catch(e => {
        console.log("error", e.response);
    });
}
function duplicarRecompensa(recompensa){
    let nuevaPropiedad = JSON.parse(JSON.stringify(recompensa));
    delete nuevaPropiedad.broadcaster_name;
    delete nuevaPropiedad.broadcaster_login;
    delete nuevaPropiedad.broadcaster_id;
    delete nuevaPropiedad.id;
    nuevaPropiedad.title = nuevaPropiedad.title + "_dup";
    console.log("duplicar", recompensa, nuevaPropiedad);
    crearRecompensa(nuevaPropiedad);
}
function crearRecompensa(recompensa){
    const urlUpdateReward = 'https://api.twitch.tv/helix/channel_points/custom_rewards',
        url = `${urlUpdateReward}?broadcaster_id=${datosRecompensas.broadcaster_id}`;

    axios.post(url, recompensa)
    .then(response => {
        console.log("respuesta creacion:", recompensa, response.data);
    }).catch(e => {
        console.log("error", e.response);
    });

}
initRecompensas();