<script>
    import { asset } from "$app/paths";
    import { socket } from "$lib/const/const";
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    import "$lib/assets/style/global.css";
    
    /** @type {import('./$types').PageProps} */
    let {data} = $props()
    import { page } from "$app/state";

</script>


<!-- Chart or Table Placeholder -->
<div class="bg-white p-6 rounded-xl shadow min-h-[300px]">
    <h2 class="text-lg font-semibold mb-4 text-gray-700">My Profile</h2>
    <h3 class="text-lg font-semibold mb-4 text-gray-700"> This page is under construction. nothing to see here</h3>
    <p class="text-gray-600 mb-6 text-wrap">This will be the user profile page where user can update their profile information such as username, email, password, avatar, etc.
    </p>
</div>