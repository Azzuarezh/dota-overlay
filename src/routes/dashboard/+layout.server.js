import { redirect } from '@sveltejs/kit';
import { getUserById } from '../../repository/models/Users/Users';
/** @type {import('./$types').LayoutServerLoad} */
export async function load(event){
     if (event.locals.session === null || event.locals.user === null) {
        return redirect(302, "/login");
    }

    const user = await getUserById(event.locals.user.userId)
    const userDao = {id:user.id, firstName : user.firstName, email:user.email, username:user.username}

    return {
        user: userDao,
        session: event.locals.session
    };
 }