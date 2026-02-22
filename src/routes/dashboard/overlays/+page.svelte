<script>
    import { asset } from "$app/paths";
    import GsiModal from "$lib/components/GsiModal.svelte";
    import { enhance } from '$app/forms';
    import { invalidate, invalidateAll } from '$app/navigation';
    import "$lib/assets/style/global.css";
    let showModal = $state(false);
    let showExplanationModal = $state(false);
    let showConfigScriptModal = $state(false);
    let selectedToken = $state("");
    let selectedTokenName = $state("");
    const [CREATE_TOKEN,UPDATE_TOKEN] = ["CREATE_TOKEN","UPDATE_TOKEN"];

    /** @type {import('./$types').PageProps} */
    let {data} = $props()
    import { page } from "$app/state";
    let gsiClients = $derived(page.data.gsi_clients) 

    let tokenNameFromInput= $state("")
    let inputElement;

    let actionType = $state("");

    async function handleSubmit(action) {

      if(action == CREATE_TOKEN){
        if(!inputElement.reportValidity()) return false;

        const response = await fetch('/dashboard/overlays/create', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({token_name:tokenNameFromInput})
        });
        if (response.status == 200) {
        // rerun all `load` functions, following the successful update
          await invalidate('gsi:list');
          return true
        }
        else{
          await invalidate('gsi:list');
          return false
        }
      }
      if(action == UPDATE_TOKEN){
        if(!inputElement.reportValidity()) return false;
        const response = await fetch('/dashboard/overlays/update', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({token_name:tokenNameFromInput, token:selectedToken})
        });

        if (response.status == 200) {
        // rerun all `load` functions, following the successful update
          await invalidateAll();
          return true
        }
        else if(response.status == 400){
          await invalidateAll();
          return false
        }
        else{
          await invalidateAll();
          return false
        }
      }
      tokenNameFromInput = "";
    }

    async function handleDelete(token){
      if(confirm(`Are you sure you want to delete the token: ${token} ? This action cannot be undone.`)){
        const response = await fetch('/dashboard/overlays/delete', {
          method: 'DELETE',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({ token:token})
        });

        if (response.status == 200) {
        // rerun all `load` functions, following the successful update
          await invalidateAll();
          return true
        }
        else{
          await invalidateAll();
          return false
        }
      }
    }

</script>


<!-- Chart or Table Placeholder -->
<div class="bg-white p-6 rounded-xl shadow min-h-[300px]">
    <h2 class="text-lg font-semibold mb-4 text-gray-700">Overlays list</h2>
    <h3 class="text-lg font-semibold mb-4 text-gray-700"> Click one of the client names to go to overlays page</h3>
    <p class="text-gray-600 mb-6 text-wrap">Manage your Gamestate Integration (GSI) tokens below. Create, update, or delete tokens as needed for your overlays. <br/>
      Only one token used for one Dota 2client overlay. If you have multiple Dota 2 clients running overlays, please create multiple config file accordingly.
    </p>
    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 " onclick={() => {
        actionType = CREATE_TOKEN
        showModal = true
      }}>
      Create new Token
    </button>


     <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 " onclick={() => showExplanationModal = true}>
      Learn about GSI Tokens 
    </button>
    <table class="min-w-full border border-gray-200 rounded-lg text-sm mt-5">
            <thead class="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th class="px-4 py-2 text-left border-b">GSI Client Name</th>
                <th class="px-4 py-2 text-left border-b">Client Token</th>
                <th class="px-4 py-2 text-left border-b">Action</th>
              </tr>
            </thead>
            {#if gsiClients.length > 0}
               <tbody>
              {#each gsiClients as client, i (client.id)}
                <tr class:bg-gray-50={i % 2 === 0} class="hover:bg-blue-50 transition">
                  <td class="px-4 py-2 border-b font-medium text-gray-800"><strong><a class="text-lg" href={`${page.route.id}/${client.id}`}>{client.name}</a></strong></td>
                  <td class="px-4 py-2 border-b text-gray-600"><strong>{client.token}</strong></td>
                  <td class="px-4 py-2 border-b text-gray-600">
                    <button class="bg-blue-600 text-white hover:bg-blue-700 text-md rounded-sm p-2" onclick={()=> {
                      selectedToken = client.token
                      showConfigScriptModal = true
                      }}>Open Configuration</button>
                    <button class="bg-blue-600 text-white hover:bg-blue-700 text-md rounded-sm p-2"onclick={() => {
                      actionType = UPDATE_TOKEN
                      selectedToken = client.token
                      selectedTokenName = client.name
                      tokenNameFromInput = client.name
                      showModal = true
                      }}>Update Token Name</button>
                    <button class="text-white text-md rounded-sm p-2 bg-red-600  hover:bg-red-700" onclick={() => handleDelete(client.token)}>Delete</button></td>
                </tr>
              {/each}
            </tbody>
            {:else}
             <tbody>
                <tr class="hover:bg-blue-50 transition">
                  <td colspan="3"  class="px-4 py-2 border-b text-gray-600 text-center text-2xl">No GSI Token available for this user</td>
                </tr>            
            </tbody>
            {/if}
           
          </table>
</div>

<GsiModal bind:open={showModal} title="Gamestate Integration Token" bind:tokenName={tokenNameFromInput}  onConfirm={() => handleSubmit(actionType)} bind:selectedToken={selectedToken} >
  
  <form action="?/create" method="POST" use:enhance>
    <div>
        <label for="gsi-token" class="block text-sm/6 font-medium text-black-800">Token name (alphanumeric without space character)</label>
        <div class="mt-2">
          <input bind:this={inputElement} bind:value={tokenNameFromInput} id="gsi-token" type="text" name="gsi-token" required class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 
          outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" placeholder={selectedToken}/>
        </div>
      </div>
  </form>
  
</GsiModal>


<GsiModal bind:open={showExplanationModal} title="Gamesate Integration Token Usage" hideControlButtons={true}>
  
  <h2 class="text-lg font-semibold mb-4 text-gray-700">How to use your GSI token:</h2>
  <ol class="list-decimal list-inside space-y-2 px-4 mb-2">
    <li>Copy the script from the list.</li>
    <!-- <div class="h-50 w-full">
      <code>some page abc</code>
    </div> -->
    <li>Create new file with format <strong>gamestate_integration</strong>_*.cfg (change * to your custom name e.g <strong>gamestate_integration_OBS.cfg</strong>)</li>
    <li>Paste the copied script into the newly created file and save it to steamapps dota folder.</li>
    <li>Open Steam and go to library. right click on Dota and select properties...</li>
    <li>Add new arguments in launch options <i>-gamestateintegration</i> to Enable Gamesate Integration</li>
    <li>Restart Dota 2 client to ensure the changes take effect.</li>
  </ol>
  <p class="text-lg font-bold">If you want to know more on how to do this, please read this <a href="https://support.overwolf.com/support/solutions/articles/9000212745-how-to-enable-game-state-integration-for-dota-2">article</a> 
    or watch this youtube <a href="https://www.youtube.com/watch?v=7MTPiY7mB0c">video tutorial</a>. (the video is not mine)<br/>
    
  </p>

</GsiModal>


<GsiModal bind:open={showConfigScriptModal} title="Gamesate Integration Configuration File" hideControlButtons={true}>
  
  <h2 class="text-lg font-bold">Copy this script below to file .cfg</h2>
  <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto">
<code>{`"dota2-gsi Configuration"
{
    "uri"               "http://localhost:3000/api/gsi"
    "timeout"           "1.0"
    "buffer"            "0.1"
    "throttle"          "0.1"
    "heartbeat"         "30.0"
    "data"
    {
        "player"        "1"
        "hero"          "1"
        "items"         "1"
        "draft"         "1"
        "provider"      "1"
        "league"        "1"
        "map"           "1"
        "buildings"     "1"
        "events"        "1"
        "roshan"        "1"
        "couriers"      "1"
    }
    "auth"
    {
        "token"         "${selectedToken}"
    }
}`}</code>
  </pre>
  
</GsiModal>


