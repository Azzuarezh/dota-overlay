import {GS_DRAFT, GS_STRAT,GS_PRE,GS_INGAME,GS_POST,GS_LAST,GS_DC, formatTime,gsiSocket} from '$lib/const/const.js'
import { error } from '@sveltejs/kit';

import { findGsiTokenByValue } from '../../../repository/models/Users/UserGsiToken.js';
import { getUserById } from '../../../repository/models/Users/Users.js';

/* this function is to check when broadcaster/user selecting the player hero. giving the state of the screen focus on the player
    giving us a way to serve information (e.g player picture/kda/etc.)
*/
function get_selected_player(heroes){
    let selected_player = null;
    Object.keys(heroes).forEach(player => {
       if(heroes[player].selected_unit){
        selected_player = player
        return
       }
    });
   return selected_player
}


export async function POST(event){
    const requestdata = await event.request.json()
    const gsiToken = requestdata.auth.token
    const userGsiToken = await findGsiTokenByValue(gsiToken)
    if(!userGsiToken){
         error(404,{
                message:"Token not found"
            })
    }

    //need to specify where this integration
    const user = await getUserById(userGsiToken.userId)
    const targetSocket = {
        userId: user.id,
        gsi_client_id: userGsiToken.id
    }
    //gsiSocket.emit('ping', {...{foo:'bar',baz:'1'},...{target_socket:targetSocket}})

    //const client = event.getClientAddress();
    //console.log('client: ', client)
    const draft_data= {
        provider    : requestdata.provider,
        league      : requestdata.league,
        map         : requestdata.map,
        draft       : requestdata.draft,
        player      : requestdata.player,
        hero        : requestdata.hero,
        added       : requestdata.added,
        previously  : requestdata.previously,
        target_socket: targetSocket
    }

    const game_event_data = {
        provider    : requestdata.provider,
        map         : requestdata.map,
        league      : requestdata.league,
        buildings   : requestdata.buildings,
        player      : requestdata.player,
        hero        : requestdata.hero,
        items       : requestdata.items,
        couriers    : requestdata.couriers,
        roshan      : requestdata.roshan,
        events      : requestdata.events,
        added       : requestdata.added,
        previously  : requestdata.previously,
        target_socket: targetSocket
    }

   
    if(requestdata.map){
        //PLEASE ALSO UPDATE LISTENER IN server.io

        //event to check game time and clock time
        gsiSocket.emit('gsi-client:time', {
            game_state : requestdata.map.game_state,
            game_time  : formatTime(requestdata.map.game_time),
            clock_time : formatTime(requestdata.map.clock_time),
            target_socket: targetSocket
        })
       
    switch (requestdata.map.game_state) {
        case GS_DRAFT:
            gsiSocket.emit('gsi-client:draft',draft_data)
            break;
        case GS_STRAT:
            gsiSocket.emit('gsi-client:strategy',true)
            break;
        case GS_PRE:
            gsiSocket.emit('gsi-client:pregame',game_event_data)
            break;
        case GS_INGAME:
            gsiSocket.emit('gsi-client:ingame',game_event_data)
              
            //only send event player when game state is ingame to avoid not finding player account id
            if(requestdata.player){
                //show player in the match
                gsiSocket.emit('gsi-client:players', {...requestdata.player.team2, ...requestdata.player.team3, ...{target_socket: targetSocket}})

            }


            gsiSocket.emit('gsi-client:items', {...game_event_data.items.team2, ... game_event_data.items.team3, ...{target_socket: targetSocket}})
            gsiSocket.emit('gsi-client:added',{ ...game_event_data.added,...{target_socket: targetSocket}})
            gsiSocket.emit('gsi-client:previously', {...game_event_data.previously,...{target_socket: targetSocket}})
            break;
        case GS_POST:
            gsiSocket.emit('gsi-client:postgame', {target_socket: targetSocket})
            break;
        case GS_LAST:
            gsiSocket.emit('gsi-client:last', {target_socket: targetSocket})
            break;
        case GS_DC:
            gsiSocket.emit('gsi-client:disconnect', {target_socket: targetSocket})
            break;
            }

        let heroes = {...game_event_data.hero.team2, ...game_event_data.hero.team3, ...{target_socket: targetSocket}}
        gsiSocket.emit('gsi-client:heroes',heroes)    
        const selected_player =  get_selected_player(heroes)        
        gsiSocket.emit('gsi-client:players:selected', {selected_player, ...{target_socket: targetSocket}})
    }
      //PLEASE ALSO UPDATE LISTENER IN server.js
    if(requestdata.roshan){
        gsiSocket.emit('gsi-client:roshan',{...requestdata.roshan, ...{target_socket: targetSocket}})
    }

    if(requestdata.league){
        gsiSocket.emit('gsi-client:league',{...requestdata.league, ...{target_socket: targetSocket}})
    }
    //PLEASE ALSO UPDATE LISTENER IN server.js
    if(requestdata.events && requestdata.events.length > 0){
        let gameEvt = requestdata.events;
        gameEvt.forEach((evt)=>{evt.game_time = evt.game_time})
        gsiSocket.emit('gsi-client:events',{...gameEvt, ...{target_socket: targetSocket}})
    }
     //this just to check whether gsi client is connected before it disconnected (breath check)
    gsiSocket.emit('gsi-client:ping',{
            target_socket: targetSocket
    })

    return new Response(undefined,{status:200})
}