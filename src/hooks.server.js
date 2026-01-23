
import { getUserById } from "./repository/models/Users/Users";
import { setSessionTokenCookie, deleteSessionTokenCookie, validateSessionToken } from "./repository/models/Users/UserSessions";
import { socket } from "$lib/const/const";
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }){
	//allow overlay endpoint to be accessed without session
	// if (event.url.pathname.startsWith('/overlays')) {
	// 	return resolve(event)
	// }
	
	// if(!gsiSocket.connected) gsiSocket.connect()
	
	const token = event.cookies.get("session") ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const session = await validateSessionToken(token);
	if (session !== null) {
		// setSessionTokenCookie(event, token, session.expiredAt);
        setSessionTokenCookie(event,token,session.expiredAt)
		const user = await getUserById(session.userId)
		event.locals.user = {
			userId: user.id, 
			username : user.userName, 
			email: user.email
		}

		event.locals.session = {
			sessionToken: session.sessionToken,
			expiredAt : session.expiredAt,
			userId: session.userId
		};
		socket.auth ={token:session.sessionToken, client_type:'app_client'}
		if(!socket.connected) socket.connect()
	} else {
		deleteSessionTokenCookie(event);
	}

	return resolve(event);
};
