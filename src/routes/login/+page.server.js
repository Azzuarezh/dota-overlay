import { redirect, fail } from "@sveltejs/kit";
import {getUserByUserName} from '../../repository/models/Users/Users.js';
import { generateSessionToken, createSessionToDb, setSessionTokenCookie } from '../../repository/models/Users/UserSessions.js';
import { verifyPasswordHash } from '$lib/server/util/password.js';
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
export const actions = {
	default: action
};

export function load(event) {
    if(Object.keys(event.locals).length !== 0 && event.locals.session !== null && event.locals.user !== null){
		return redirect(302, "/dashboard");
	}
	return {};
}

async function action(event){
    const formData = await event.request.formData();
    const username = formData.get("username");
	const password = formData.get("password");

    if (typeof username !== "string" || typeof password !== "string") {
           return fail(400, {
                message: "Invalid or missing fields",
                email: ""
            });
        }
    if (username === "" || password === "") {
        return fail(400, {
            message: "Please enter your username and password.",
            username
        });
    }
    
    const user = await getUserByUserName(username)
    if(user === null){
        return fail(400,{message:"username not found.", username})
    }
    const validPassword = await verifyPasswordHash(user.password, password);
    if (!validPassword) {
        return fail(400, {
            message: "Invalid password",
            username
        });
    }
    const sessionToken = generateSessionToken();
    const encodedToken = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
    const tokenExp = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	const session = await createSessionToDb(encodedToken, user.id, tokenExp);
    setSessionTokenCookie(event,encodedToken,tokenExp)

    return redirect(302, "/dashboard");
}
