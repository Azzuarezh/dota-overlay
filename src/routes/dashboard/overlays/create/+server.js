import { json, fail } from '@sveltejs/kit';
import { createGsiToken } from '../../../../repository/models/Users/UserGsiToken';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { token_name } = await event.request.json();
    if(Object.keys(event.locals).length !== 0 && event.locals.session !== null && event.locals.user !== null){
      try{
         createGsiToken(event.locals.user.userId,token_name)
        return json({success:true})
      }
      catch(err){
         fail(400, {message: "could not create GSI token"});
      }
      fail(400, {message: "could not create GSI token"}); 
    }
	
}