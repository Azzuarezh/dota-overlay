import { json, fail } from '@sveltejs/kit';
import { createNewPlayer } from '../../../../../repository/models/Dota/player/DotaPlayers';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
    const { account_id,steam_id,name,role } = await event.request.json();
    if(Object.keys(event.locals).length !== 0 && event.locals.session !== null && event.locals.user !== null){
      try{
         createNewPlayer(steam_id,account_id,name,role,null)
        return json({success:true})
      }
      catch(err){
         fail(400, {message: "could not create new player"});
      }
      fail(400, {message: "could not create new"}); 
    }
    
}