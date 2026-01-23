import { findGsiTokenByUserId } from '../../../repository/models/Users/UserGsiToken';
/** @type {import('./$types').PageServerLoad} */
export async function load(event){
    const tokens = await findGsiTokenByUserId( event.locals.user.userId) 
    const gsi = []
    if(tokens.length > 0){
       tokens.forEach(token=>{
        gsi.push(token.toJSON())
       })
    }
    
  return {gsi_clients : gsi}
}