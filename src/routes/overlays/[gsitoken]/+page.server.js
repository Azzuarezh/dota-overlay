import { error } from '@sveltejs/kit';
import { findGsiTokenByValue } from '../../../repository/models/Users/UserGsiToken.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    if(!isValidUUID(params.gsitoken))error(403,'invalid GSI token')
    const token = await findGsiTokenByValue(params.gsitoken)
    if(token){
        return {
		        overlay_id: params.gsitoken,
            overlay_name:'client 1'
	    };
    }


     error(404, 'gsi client not found');
}


const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

function isValidUUID(uuid) {
  return uuidRegex.test(uuid);
}