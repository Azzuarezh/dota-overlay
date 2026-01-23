export function load(event) {
    if(Object.keys(event.locals).length !== 0 && event.locals.session !== null && event.locals.user !== null){
		return redirect(302, "/dashboard");
	}
	return {};
}