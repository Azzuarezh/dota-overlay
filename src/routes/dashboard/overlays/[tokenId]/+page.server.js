import { findGsiTokenById } from '../../../../repository/models/Users/UserGsiToken'
/** @type {import('./$types').PageServerLoad} */
export async function load({params}){
   const gsi = await findGsiTokenById(params.tokenId)
   return {gsi_client : gsi?.toJSON()}
}