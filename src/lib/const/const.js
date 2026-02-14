export const [GS_INIT, GS_WAIT, GS_DRAFT, GS_STRAT, GS_SHOW, GS_PRE, GS_INGAME, GS_POST, GS_LAST, GS_DC] =
    [
        "DOTA_GAMERULES_STATE_INIT",
        "DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD",
        "DOTA_GAMERULES_STATE_HERO_SELECTION",
        "DOTA_GAMERULES_STATE_STRATEGY_TIME",
        "DOTA_GAMERULES_STATE_TEAM_SHOWCASE",
        "DOTA_GAMERULES_STATE_PRE_GAME",
        "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS",
        "DOTA_GAMERULES_STATE_POST_GAME",
        "DOTA_GAMERULES_STATE_LAST",
        "DOTA_GAMERULES_STATE_DISCONNECT"
    ];
  
export const MATCH_SERIES = [
    {"label":"Best of 1","value":"bo1"},
    {"label":"Best of 3","value":"bo3"},
    {"label":"Best of 5","value":"bo5"}
  ];

 export const [GENERIC_EVENT,EVENT_ROSHAN_KILLED, EVENT_TORMENTOR_KILL, EVENT_ITEM_PURCHASE, FIRST_BLOOD] = [
        "generic_event",
        "roshan_killed",
        "CHAT_MESSAGE_MINIBOSS_KILL",
        "CHAT_MESSAGE_ITEM_PURCHASE",
        "CHAT_MESSAGE_FIRSTBLOOD"
    ];
    
 export  const formatTime = (seconds)=>{
    if (isNaN(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  export  const formatTimeWithRoundedSecond = (seconds)=>{
    if (isNaN(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${Math.floor(remainingSeconds)}`;
  }

import io from "socket.io-client";
//this is socket io client for web app user, set autoconnect false to make sure if disconnected. it must relogin
//manual connect when login
const clientSocket = io("http://localhost:3000",{autoConnect:false});
clientSocket.on('connect', () => {
  console.log('User Connected to Socket.IO server', socket.id);
});

clientSocket.on('disconnect', (reason) => {
  console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
  //disconnect from  server check the reason
});

const gsiClientSocket = io("http://localhost:3000",{auth:{client_type:'dota_client', }});
gsiClientSocket.on('connect', () => {
  console.log('Gamestate Integration client Connected to Socket.IO server.', socket.id);
});

gsiClientSocket.on('disconnect', (reason)=>{
  console.log(`Gamestate Integration disconnected. Reason ${reason}`)
})



export const socket = clientSocket
export const gsiSocket = gsiClientSocket

