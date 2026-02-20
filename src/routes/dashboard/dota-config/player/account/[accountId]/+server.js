import { getPlayerByAccountId } from '../../../../../../repository/models/Dota/player/DotaPlayers';
import {  json,fail } from '@sveltejs/kit';

/** @type {import('../../../$types').PageServerLoad} */
export async function GET({params}){
    const player = await getPlayerByAccountId(params.accountId)
    if(!player) return fail(404,{type:"failure",message:"Player not found"})
    if(player.avatarPicture != null){
        player.avatarPicture = player.avatarPicture.toString('base64')
    }
    return json({type:"success",player})
}