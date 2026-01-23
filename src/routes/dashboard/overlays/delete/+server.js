import { json, error } from '@sveltejs/kit';
import { deleteGsiTokenByValue } from '../../../../repository/models/Users/UserGsiToken';

/** @type {import('./$types').RequestHandler} */
export async function DELETE(event) {
    const { token } = await event.request.json();
    if(Object.keys(event.locals).length !== 0 && event.locals.session !== null && event.locals.user !== null){
      try{
        await deleteGsiTokenByValue(token)
        return json({success:true})
      }
      catch(err){
          console.error("error deleting gsi token", err)
          error(400, {message: "could not delete GSI token"});
      }
    
    }
    
}