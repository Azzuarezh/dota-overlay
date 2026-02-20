import { updateTeam } from '../../../../../repository/models/Dota/team/DotaTeams';
import {json, error} from '@sveltejs/kit'

export async function PATCH(event) {  
    const teamId = event.params.teamId 
    const requestData= await event.request.json();
    requestData.id = teamId;
    const updatedteam = await updateTeam(requestData)
    if(!updatedteam) error(500,{message:'error updating player'})
    return json({type:'success', message:"Team updated"}) 

}
