 import { json } from '@sveltejs/kit';
import {updateAvatar } from '../../../../../repository/models/Dota/player/DotaPlayers';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
    const data = await request.formData();
    const playerId= data.get('playerId');
    const file = data.get('avatar');

    if (!file || file.size === 0) {
        return error(500,{message:'error creating token'})
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');

    const updatedPlayerAvatar = await updateAvatar(playerId,buffer)

    return json(updatedPlayerAvatar)
    
}