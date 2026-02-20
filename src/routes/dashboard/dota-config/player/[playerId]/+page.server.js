import { getPlayerByPlayerId } from '../../../../../repository/models/Dota/player/DotaPlayers';
import { getDotaTeamIdAndNamesAndTag } from '../../../../../repository/models/Dota/team/DotaTeams';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({params, depends}){
    const player = await getPlayerByPlayerId(params.playerId)

    //needed for changing team in player 
    const teamList = await getDotaTeamIdAndNamesAndTag();

    if(!player) return error(404,{"message":"player not found"})
    if(player.avatarPicture != null){
        player.avatarPicture = player.avatarPicture.toString('base64')
    }

    if((player.team != null) && player.team.logo != null){
        player.team.logo = player.team.logo.toString('base64')
    }

    depends('player:detail')
    return{ player: player?.toJSON(), teams:JSON.parse(JSON.stringify(teamList))
        }
}
