<script>
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/assets/style/global.css';
	import '$lib/assets/style/fonts.css';

  import { asset } from '$app/paths';
  import { page } from '$app/state';
  import { socket } from '$lib/const/const';
  import { enhance } from "$app/forms";
	/** @type {import('./$types').LayoutProps} */
	let {  data, children } = $props();

  let showDropdown = $state(false); // Avatar dropdown
  let openMenu = $state(null); // Sidebar submenu state

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function toggleMenu(name) {
    openMenu = openMenu === name ? null : name;
  }

  // Close dropdown when clicking outside
  function onclick(event) {
    if (!event.target.closest("#avatarDropdown")) {
      showDropdown = false;
    }
  }
let routes  = page.route?.id?.split('/')


</script>
<svelte:document />
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="flex h-screen overflow-hidden">

    <!-- Sidebar -->
  <aside class="w-64 bg-white shadow-lg flex flex-col">
    <div class="p-4 text-2xl font-bold border-b border-gray-200">
      Dashboard
    </div>

    <nav class="flex-1 p-4 text-gray-700">
      <ul class="space-y-2">

        <!-- Settings -->
        <li>
          <button
            onclick={() => toggleMenu("settings")}
            class="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
          >
            <span>⚙️ Settings</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 transform transition-transform duration-200"
              class:rotate-90={openMenu === "settings"}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {#if openMenu === "settings"}
            <ul class="ml-8 mt-1 space-y-1 text-sm animate-fadeIn">
              <li class="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"><a href="/dashboard/user">Profile</a></li>
              <li class="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"><a href="/dashboard/overlays">Overlays</a> </li>
              <li class="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"><a href="/dashboard/dota-config">Dota Configuration</a></li>
            </ul>
          {/if}
        </li>
      </ul>
    </nav>
  </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <!-- Top Bar -->
      <header class="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
         <h1 class="text-xl font-semibold text-gray-700">{(routes.length > 3)?routes[2].toUpperCase() : routes[routes.length -1].toUpperCase()}</h1>
          <div class="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              class="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />

            <!-- Avatar Dropdown -->
            <div id="avatarDropdown" class="relative">
              <button onclick={toggleDropdown} class="focus:outline-none">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="User"
                  class="w-10 h-10 rounded-full border hover:ring-2 hover:ring-blue-300"
                />
              </button>

              {#if showDropdown}
                <div
                  class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg animate-fadeIn"
                >
                  <div class="px-4 py-2 text-sm text-gray-700 border-b">
                    Signed in as <br /><span class="font-semibold">User</span>
                  </div>
                  <form method="post" action="/logout" use:enhance>
                      <button
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
                      >
                      Logout
                    </button>
                  </form>
                  
                </div>
              {/if}
            </div>
          </div>
      </header>

      <!-- Content Area -->
      <main class="p-6 space-y-6">
        <!-- Stats Cards -->
          {@render children()}
      </main>
    </div>
  </div>
