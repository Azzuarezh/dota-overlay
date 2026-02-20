import {json} from '@sveltejs/kit'

export async function DELETE(event) {   
    const data = await event.request.json()
    const playerId = data.playerId;
    const player = await getPlayerByPlayerId(playerId);
    player?.destroy()
    return json({success:true})  
    
}