import { json, fail } from '@sveltejs/kit';
import { createNewPlayer } from '../../../../repository/models/Dota/player/DotaPlayers';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
    const { account_id,steam_id,name,role } = await event.request.json();
    const createdPlayer = await createNewPlayer(account_id,steam_id,name,role,null)
    if(!createdPlayer) error(500,{message:'error creating token'})
    return json(createdPlayer) 
    
}
