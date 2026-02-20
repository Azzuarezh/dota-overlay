
import {json, fail} from '@sveltejs/kit'
import { updateAvatar } from '../../../../../../repository/models/Dota/player/DotaPlayers.js';
export async function PATCH({request,params}){
    const playerId = params.playerId;
    const data = await request.formData();
    const file = data.get('avatar');

    if (!file || file.size === 0) {
        fail(400, { error: 'No file uploaded' });
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');

    const updatedPlayerAvatar = await updateAvatar(playerId,buffer)
    if(!updateAvatar) fail(500,{message:"could not upload file"})
    return json({type:"success", player: updatedPlayerAvatar})
}