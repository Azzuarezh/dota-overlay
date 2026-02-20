import { updatePlayer } from '../../../../../repository/models/Dota/player/DotaPlayers';
import {json, error} from '@sveltejs/kit'

export async function PATCH(event) {   
    const playerId = event.params.playerId;
    const requestData = await event.request.json()
    requestData.id = playerId;
    requestData.teamId = requestData.teamId;
    const updatedPlayer = await updatePlayer(requestData)
    if(!updatedPlayer) error(500,{message:'error updating player'})
    return json({type:'success', message:"player updated"}) 

}
