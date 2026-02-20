import { createNewPlayer,getPlayerBySteamId,getPlayerByAccountId } from '../../../../repository/models/Dota/player/DotaPlayers';
import {  fail } from '@sveltejs/kit';

export const actions = {
    default: addPlayer,
};

/** @type {import('./$types').PageServerLoad} */
export async function load({params, depends}){
    const player = await findPlayerById(params.steamId)
    const teamList = await getDotaTeamIdAndNamesAndTag();
    
    if(player.avatarPicture != null){
        player.avatarPicture = player.avatarPicture.toString('base64')
    }

    depends('player:detail')
    return{ player: player?.toJSON(), teams:JSON.parse(JSON.stringify(teamList))}
}

async function addPlayer(event){
    const formData = await event.request.formData();
    const steamId = formData.get("steamId");
    const accountId = formData.get("accountId");
    const name = formData.get("name");
    const rolePosition = formData.get("rolePosition");



    const checkPlayerSteamId = await getPlayerBySteamId(steamId)
    if(checkPlayerSteamId != null) return fail(422, { message:"Steam ID already registered to another player."});
    const checkPlayerAccountId = await getPlayerByAccountId(accountId)   
    if(checkPlayerAccountId != null) return fail(422, { message:"Account ID already registered to another player"});

    try{
        const playerObject = {
            steamId:steamId,
            accountId:accountId,
            name:name,
            rolePosition:rolePosition
        }
        const newPlayer = await createNewPlayer(playerObject)
        return {player: newPlayer?.toJSON()}
    }
    catch(err){
        return fail(500, { message: err.message});
    }
}