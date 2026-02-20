import { getDotaTeamByTeamId } from '../../../../repository/models/Dota/team/DotaTeams'
import {json, error} from '@sveltejs/kit'
export async function DELETE(event) {   
    const data = await event.request.json()
    const teamId = data.teamId;
    const team = await getDotaTeamByTeamId(teamId);
    team?.destroy()
    return json({success:true})  
    
}