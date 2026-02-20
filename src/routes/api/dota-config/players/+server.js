import { json, fail } from '@sveltejs/kit';
import { createNewPlayer, updatePlayer, getPlayerByAccountId } from '../../../../repository/models/Dota/player/DotaPlayers';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
    const { steamId,accountId,name,rolePosition } = await event.request.json();
    const playerRequest ={
        steamId:steamId,
        accountId:accountId,
        name:name,
        rolePosition:rolePosition,
    }
    console.log('player request: ', playerRequest)
    const createdPlayer = await createNewPlayer(playerRequest)
    if(!createdPlayer) error(500,{message:'error creating token'})
    return json(createdPlayer) 
    
}

export async function PATCH(event) {
    const { id,steamId,accountId,name,rolePosition,teamId } = await event.request.json();
    const playerRequest ={
        id:id,
        steamId:steamId,
        accountId:accountId,
        name:name,
        rolePosition:rolePosition,
        DotaTeamId:teamId
    }
    const updatedPlayer = await updatePlayer(playerRequest)
    if(!updatedPlayer) error(500,{message:'error creating player'})
    return json(updatedPlayer) 
    
}
