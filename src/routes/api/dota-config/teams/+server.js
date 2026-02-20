import { json, fail,error } from '@sveltejs/kit';
import { createDotaTeam, getDotaTeams } from '../../../../repository/models/Dota/team/DotaTeams';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
    const { teamName,teamTag } = await event.request.json();
    const createdTeam = await createDotaTeam(teamName,teamTag)
    if(!createdTeam) error(500,{message:'error creating dota team'})
    return json(createdTeam)    
}


/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
    const teamList = await getDotaTeams();
    if(!teamList) error(404,{message:"no team yet"})
    teamList.forEach(team =>{
        if(team.logo !=null) team.logo = team.logo.toString('base64')
    })
    return json(teamList)    
}
