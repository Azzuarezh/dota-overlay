import { getDotaTeamByTeamId,createDotaTeam} from '../../../../repository/models/Dota/team/DotaTeams';
import {  fail } from '@sveltejs/kit';

export const actions = {
    default : addTeam,
}

/** @type {import('./$types').PageServerLoad} */
export async function load({params, depends}){
    const team = await getDotaTeamByTeamId(params.teamId)
    if(team.logo != null){
        team.logo = team.logo.toString('base64')
    }

    depends('team:detail')
    return{ team: team?.toJSON()}
}

async function addTeam(event){
    const formData = await event.request.formData();
    const teamId = formData.get("team-id")
    const teamName = formData.get("team-name");
    const teamTag = formData.get("team-tag");

    try{
        const newTeam = await createDotaTeam(teamId,teamName,teamTag)
        return {team: newTeam?.toJSON()}
    }
    catch(err){
        return fail(500, { message: err.message});
    }
}