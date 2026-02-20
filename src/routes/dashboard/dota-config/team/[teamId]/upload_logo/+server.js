
import {json, fail, error} from '@sveltejs/kit'
import { updateTeamLogo } from '../../../../../../repository/models/Dota/team/DotaTeams';
export async function PATCH({request,params}){
    const teamId = params.teamId;
    const data = await request.formData();
    const file = data.get('teamLogo');

    if (!file || file.size === 0) {
        fail(400, { error: 'No file uploaded' });
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');

    try{
        const updatedTeamLogo = await updateTeamLogo(teamId,buffer)
        if(!updatedTeamLogo) fail(500,{message:"could not upload file"})
        return json({type:"success", team: updatedTeamLogo})
    }
    catch(err){
        console.log(err)
       return json({type:"failure"})
    }
    
}