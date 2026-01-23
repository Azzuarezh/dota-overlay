<script>
    import { enhance, applyAction, deserialize } from "$app/forms";
    import { asset } from "$app/paths";
    import { invalidateAll, goto } from '$app/navigation';
    import { error } from "@sveltejs/kit";
    let { form }= $props()

    let userHasCreated = $state(false)
    let errorCreateuser = $state(false)
    let errorMsg = $state('')

    /** @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}} event */
	async function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget, event.submitter);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
      headers: {
        'x-sveltekit-action': 'true'
      },
			body: data
		});

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());
		if (result.type === 'success') {
			// rerun all `load` functions, following the successful update
			await invalidateAll();
            userHasCreated = true

            setTimeout(()=> {goto('/login')},5000)
		}
        else if(result.type ==='failure'){
            //await invalidateAll()
            errorCreateuser = true
            errorMsg = result.data.message?result.data.message:''
        }

		applyAction(result);
        console.log('is user has created?',userHasCreated)
	}
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img src={asset("/resources/image_style/pick_logo_purple.png")} alt="Organizatino" class="mx-auto w-auto" />
    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">Sign Up</h2>


    {#if userHasCreated}
        <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold">User has been created</p>
                <p class="text-sm">This page will be redirected to login page in 5 seconds.</p>
                </div>
            </div>
        </div>
    {/if} 
    
    {#if errorCreateuser}
        <div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
                <div class="py-1"><svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                <p class="font-bold">Error creating new user</p>
                <p class="text-sm">{errorMsg}</p>
                </div>
            </div>
        </div>
    {/if}
    

  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-1 border-solid border-b-fuchsia-600 rounded-lg p-2">
    <form method="POST" class="space-y-6" use:enhance onsubmit={handleSubmit}>
      
      <div>
        <label for="firstname" class="block text-sm/6 font-medium text-black-800">First Name</label>
        <div class="mt-2">
          <input id="firstname" type="text" name="firstname" required class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>
      <div>
        <label for="lastname" class="block text-sm/6 font-medium text-black-800">Last Name</label>
        <div class="mt-2">
          <input id="lastname" type="text" name="lastname" autocomplete="email" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>
      <div>
        <label for="email" class="block text-sm/6 font-medium text-black-800">Email</label>
        <div class="mt-2">
          <input id="email" type="email" name="email" required autocomplete="email" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>

        <div>
        <label for="username" class="block text-sm/6 font-medium text-black-800">Username</label>
        <div class="mt-2">
          <input id="username" type="text" name="username" required autocomplete="email" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm/6 font-medium text-gray-800">Password</label>
         
        </div>
        <div class="mt-2">
          <input id="password" type="password" name="password" required autocomplete="current-password" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="retypepassword" class="block text-sm/6 font-medium text-gray-800">Re-type Password</label>
         
        </div>
        <div class="mt-2">
          <input id="retypepassword" type="password" name="retypepassword" required autocomplete="current-password" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Create Account</button>
      </div>
    </form>
  </div>
  <!-- <div>
    <p>{form?.message ?? ""}</p>
    
  </div> -->
</div>