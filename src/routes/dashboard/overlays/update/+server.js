import { json, error } from '@sveltejs/kit';
import { updateGsiToken } from '../../../../repository/models/Users/UserGsiToken';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
    const { token_name, token } = await event.request.json();
    if(Object.keys(event.locals).length !== 0 && event.locals.session !== null && event.locals.user !== null){
      try{
        await updateGsiToken(token_name, token)
        return json({success:true})
      }
      catch(err){
          console.error("error updating gsi token", err)
          error(400, {message: "could not update GSI token"});
      }
    
    }
    
}