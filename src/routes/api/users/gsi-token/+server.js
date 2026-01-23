
import { error, json } from '@sveltejs/kit';
import { createGsiToken } from '../../../../repository/models/Users/UserGsiToken.js';

export async function POST(event){
    const requestdata = await event.request.json()
    const createdToken = await createGsiToken(requestdata.userId,requestdata.token_name)
    if(!createGsiToken) error(500,{message:'error creating token'})
    return json(createdToken)
}