import { error,json } from '@sveltejs/kit';
import { getDotaTeamByTeamId } from '../../../../../repository/models/Dota/team/DotaTeams';
import { getPlayersByTeamId } from '../../../../../repository/models/Dota/player/DotaPlayers';


/** @type {import('./$types').PageServerLoad} */
export async function load({params, depends}){
    const team = await getDotaTeamByTeamId(params.teamId)
    const playersInThisTeam = await getPlayersByTeamId(params.teamId)
    if(!team) return error(404,{"message":"team not found"})

    if(team.logo != null){
        team.logo = team.logo.toString('base64')
    }

    depends('team:detail')
    return{ team: team?.toJSON(), playersInTeam: JSON.parse(JSON.stringify(playersInThisTeam))}
}
