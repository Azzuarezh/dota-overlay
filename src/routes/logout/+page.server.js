import { fail, redirect } from "@sveltejs/kit";
import { invalidateSession,deleteSessionTokenCookie } from '../../repository/models/Users/UserSessions.js';
export const actions = {
    default: action
};
async function action(event){
    if (event.locals.session === null) {
		return fail(401, {
			message: "Not authenticated"
		});
	}
    console.log('session :', event.locals.session)
	invalidateSession(event.locals.session.sessionToken);
	deleteSessionTokenCookie(event);
	return redirect(302, "/login");
}
