import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    if(Object.keys(event.locals).length !== 0 && event.locals.session !== null && event.locals.user !== null){
        return redirect(302, "/dashboard");
    }
    return redirect(302,'/login');
}
