import { redirect, fail } from "@sveltejs/kit";
import {createUser, getUserByUserEmail, getUserByUserName} from '../../repository/models/Users/Users.js';
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

    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const retypePassword = formData.get("retypepassword")


    if(retypePassword !== password) return fail(422, { message:"password doesn't match with retype password"});

    const checkUserName = await getUserByUserName(username)
    const checkUserEmail = await getUserByUserEmail(email)
    if(checkUserName != null) return fail(422, { message:"username already taken"});
    if(checkUserEmail != null) return fail(422, { message:"email already taken"});

    try{
        const newUser = await createUser(firstname,lastname,email,username,password)
        return {success: true}
    }
    catch(err){
        return fail(500, { message: err.message});
    }
}
