<script>
  import { asset } from '$app/paths';
  import { GENERIC_EVENT,EVENT_ROSHAN_KILLED, EVENT_TORMENTOR_KILL, EVENT_ITEM_PURCHASE, FIRST_BLOOD } from '$lib/const/const'
  
  let data = $props();
   const target_socket = {
    userId: data.userId,
    gsi_client_id: data.gsi_client_id
  }

  
  function show_hide_roshan_overlay(){
    data.socket.emit('overlay-client:toggle_show_roshan', {target_socket: target_socket})
  }

  function show_hide_team_logo_hud(){
    data.socket.emit('overlay-client:toggle_show_team_logo_hud', {target_socket: target_socket})
  }

  function show_hide_win_probability(){
    data.socket.emit('overlay-client:toggle_show_win_probability', {target_socket: target_socket})
  }


</script>
<div>
  <h1 class="font-[radiance] text-2xl">In-game Actions</h1> 
    <a class="button-goto-overlay"
        data-sveltekit-preload-data="false" href={data.overlay_page_url} target="_blank">Open overlay page</a>
     <button class="button-show-roshan-overlay" onclick={show_hide_roshan_overlay}>Show/Hide Roshan Overlay</button>
     <button class="button-show-roshan-overlay" onclick={show_hide_team_logo_hud}>Show/Hide Team logo hud</button>
     <button class="button-show-roshan-overlay" onclick={show_hide_win_probability}>Show/Hide Win Probability</button>
</div>
    <!-- Toggle Show/Hide Match Setting -->
    <div class="w-full" >
        <div class="grid my-4 py-5">
            <h1 class="font-bold uppercase text-xl">Show Roshan Overlay</h1>
            <div class="pt-1 text-lg">below is the sample roshan overlays animation when it toggled</div>      
        </div>
        <div class="my-10 border-b border-gray-100 place-content-center">
            <div class="bg-gray-800/30 p-3">           
                <div class="grid grid-cols-2 w-full place-items-center">
                    <div>
                        <h1 class="text-4xl font-[radiance]">Sample Roshan Alive</h1>
                    </div>
                    <div>
                        <h1 class="text-4xl font-[radiance]">Sample Roshan Timer</h1>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 w-full gap-4">
                    <div class="roshan border-1 rounded-lg p-5 flex flex-row space-x-2">                  
                        <!-- Roshan Alive -->
                        <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                            <video autoplay muted loop class="items-center rounded-xl scale-[500%]">
                                    <source type="video/webm" src={asset(`/resources/roshan_animation.webm`)} />
                            </video>                
                        </div>
                        <div class="wrapper">
                        <!-- roshan item -->
                            <div class="basis-80 bg-gray-800/50 grid grid-rows-2 space-y-1 rounded-lg p-4">
                                <div class="grid grid-cols-3 space-x-2">
                                    <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                        <img alt="BKB" src={asset(`/resources/items/item_aegis.png`)} class="rounded-xl"/>
                                    </div>
                                    <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                        <img alt="BKB" src={asset(`/resources/items/item_roshans_banner.png`)} class="rounded-xl" 
                                        onerror={(e) => e.target.classList = "hidden"}/>
                                    </div>
                                    <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                        <img alt="BKB" src={asset(`/resources/items/item_refresher_shard.png`)} 
                                        onerror={(e) => e.target.classList = "hidden"}/>
                                    </div>   
                                </div>
                                <div class="grid grid-cols-3 space-x-2">
                                    <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                        <img alt="BKB" src={asset(`/resources/items/item_cheese.png`)} class="rounded-xl"
                                        onerror={(e) => e.target.classList = "hidden"}
                                        />
                                    </div>
                                    <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                        <!-- <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl"
                                        onerror={(e) => e.target.classList = "hidden"}
                                        /> -->
                                    </div>
                                    <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                        <!-- <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl"
                                        onerror={(e) => e.target.classList = "hidden"} 
                                        /> -->
                                    </div>   
                                </div>                 
                            </div>
                        </div> 
                    </div>
                    <div class="roshan border-1 rounded-lg p-5 flex flex-row space-x-2">
                        <!-- Roshan Cooldown -->
                        <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                            <div class="grid grid-rows-2">
                                <video autoplay muted loop class="items-center rounded-xl scale-[500%]">
                                    <source type="video/webm" src={asset(`/resources/roshan_animation.webm`)} />
                                </video> 
                            </div>                   
                        </div>
                        <div class="wrapper">
                        <!-- roshan item -->
                            <div class="w-full h-[60%] place-items-center place-content-center">
                                <h1 class="text-amber-600 font-[radiance] text-5xl font-extrabold">Roshan Respawn at: 00:00</h1>              
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            
        </div>
         <div class="py-2 mt-30">
            <h1 class="font-bold uppercase text-2xl">Team Logo Hud</h1>
            <div class="pt-1 text-lg">Sometimes team logo doesn't appear in dota client when the team is not a Professional teams. But we can add the logo based team which we add in dota-config page.<br/>
                below is the sample of team logo hud:
                 <img src={asset('/resources/image_style/team_logo_hud.png')}  alt="team logo hud"/>
            </div>
             
        </div>
        <div class="py-2 mt-10">
            <h1 class="font-bold uppercase text-2xl">Win Probability</h1>
            <div class="pt-1 text-lg">below is the sample win probability overlays animation</div>
             <img src={asset('/resources/image_style/win_probability.png')}  alt="win probability"/>
             <div class="pt-1 text-lg mb-">
                The calculation for win probability is not as perfect as Dota plus but this might help to determine which team is leading. <br/>
                for the formula, below described how to calculate win probability: <br/>
                <pre class="border-1 border-gray-400 rounded-xl mt-4">
                We weight the NW lead heavily. Tower diff acts as a 1000 gold "momentum" swing.
                totalAdvantage = nwLead + (towerDiff * 1000);

                Sigmoid Curve (S-Curve)
                sensitivity: how "reactive" the percentage is. 
                We decrease sensitivity as game time increases so 5k lead late-game isn't 90%.
                sensitivity = 0.0002 / (1 + (gameTimeMin / 40));
                radiantWinProb = 1 / (1 + Math.exp(-totalAdvantage * sensitivity));
                </pre>
             </div>
        </div>

      <div class="py-2 mt-20">
        <h1 class="font-bold uppercase text-2xl">Player Items (Under development)</h1>
        <p class="font-bold text-xl">This feature plan will show item timing each player. This is currently a mock up preview. Nothing happen in the overlay, also it can be used for Post game statistics.</p>
        <div class="grid grid-cols-2 place-items-center mt-10">
            <div>
                <h1 class="text-5xl font-[radiance] font-bold text-green-700">Radiant</h1>
            </div>
            <div>
                <h1 class="text-5xl font-[radiance] font-bold text-red-700">Dire</h1>
            </div>
        </div>
      </div> 
      <div class="grid px-30 grid-cols-2">
        <!-- radiant side -->
        <div class="radiant-team-player grid grid-rows-5 space-y-3">
            <!-- player one you can loop here -->
            <div class="player1 bg-green-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player1 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/bane.webm`)} />
                        </video> 
                        <!-- <h1 class="text-lg font-[radiance] font-extrabold text-red-500 text-center">Hero Name</h1> -->
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_glimmer_cape.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_arcane_boots.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ultimate_scepter.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_aeon_disk.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <!-- <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                /> -->
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_dust.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <!-- <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                /> -->
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <!-- <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                /> -->
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ward_dispenser.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl opacity-40 grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
            <div class="player2 bg-green-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player2 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/lion.webm`)} />
                        </video> 
                        <!-- <h1 class="text-lg font-[radiance] font-extrabold text-red-500 text-center">Hero Name</h1> -->
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ward_dispenser.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_force_staff.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ultimate_scepter.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_blink.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_boots.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_gem.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <!-- <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                /> -->
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <!-- <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                /> -->
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_dust.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
            <div class="player3 bg-green-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player3 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/juggernaut.webm`)} />
                        </video> 
                        <!-- <h1 class="text-lg font-[radiance] font-extrabold text-red-500 text-center">Hero Name</h1> -->
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_greater_crit.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_bfury.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_swift_blink.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_manta.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_butterfly.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_aegis.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <img alt="Daedalus" src={asset(`/resources/items/item_phase_boots.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_phase_boots.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_black_king_bar.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
            <div class="player4 bg-green-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player3 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/queenofpain.webm`)} />
                        </video> 
                        <!-- <h1 class="text-lg font-[radiance] font-extrabold text-red-500 text-center">Hero Name</h1> -->
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_power_treads.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_yasha_and_kaya.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_shivas_guard.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_blade_mail.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_refresher.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_black_king_bar.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <img alt="Daedalus" src={asset(`/resources/items/item_bottle.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_roshans_banner.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_cheese.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
            <div class="player5 bg-green-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player5 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/largo.webm`)} />
                        </video> 
                        <!-- <h1 class="text-lg font-[radiance] font-extrabold text-red-500 text-center">Hero Name</h1> -->
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_soul_ring.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_pipe.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_arcane_boots.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_holy_locket.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_solar_crest.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ultimate_scepter.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <img alt="Daedalus" src={asset(`/resources/items/item_phase_boots.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_cheese.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
        </div>
        <div class="dire-team-player grid grid-rows-5 space-y-3  place-items-end-safe">
             <div class="player6 bg-red-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row-reverse space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player6 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/mars.webm`)} />
                        </video> 
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper mr-1">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_soul_ring.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_pipe.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_phase_boots.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_crimson_guard.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_refresher.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ultimate_scepter.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <img alt="Daedalus" src={asset(`/resources/items/item_roshans_banner.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
             <div class="player7 bg-red-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row-reverse space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player7 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/abaddon.webm`)} />
                        </video> 
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper mr-1">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_manta.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_radiance.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_phase_boots.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_black_king_bar.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_refresher.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ultimate_scepter.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <img alt="Daedalus" src={asset(`/resources/items/item_heart.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
             <div class="player8 bg-red-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row-reverse space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player8 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/puck.webm`)} />
                        </video> 
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper mr-1">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_sphere.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_wind_waker.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_phase_boots.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_parasma.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_refresher.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ultimate_scepter.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <img alt="Daedalus" src={asset(`/resources/items/item_roshans_banner.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_bottle.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
             <div class="player9 bg-red-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row-reverse space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player9 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/ringmaster.webm`)} />
                        </video> 
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper mr-1">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ghost.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_aeon_disk.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tranquil_boots.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_solar_crest.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_force_staff.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ancient_janggo.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <img alt="Daedalus" src={asset(`/resources/items/item_flask.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
             <div class="player10 bg-red-900/80 w-2xl h-58 border-1 border-gray-600/30 p-5 flex flex-row-reverse space-x-2 rounded-lg">
                <!-- player photo and name -->
                <div class="basis-50 place-content-center justify-items-center-safe rounded-l">
                    <div class="grid grid-rows-2">
                        <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
                            alt="player 1"
                            class={['rounded-xl']}
                            onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}
                            />
                            <div class="relative top-1 h-7 place-content-center-safe place-items-center rounded-lg bg-gray-300 p-0.5">
                                <h1 class="text-lg font-[radiance] font-bold truncate max-w-36">Player10 Name</h1>
                            </div> 
                        
                    </div>                   
                </div>
                <!-- player hero  -->
                <div class="basis-50 place-content-center justify-items-center-safe">
                    <div class="grid grid-rows-2">
                       <video autoplay muted loop class="items-center rounded-xl">
                                <source type="video/webm" src={asset(`/resources/picks/jakiro.webm`)} />
                        </video> 
                         <div class="relative top-1 p-1 h-7 place-content-center-safe place-items-center bg-gray-300 rounded-lg ">
                                <h1 class="text-md font-[radiance] font-extrabold items-center truncate max-w-28">facet name</h1>
                            </div> 
                    </div> 
                </div>
                <div class="wrapper mr-1">
                    <!-- player item -->
                    <div class="basis-80 bg-white/20 grid grid-rows-2 space-y-1 rounded-lg">
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot1" class="bg-gray-800 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_arcane_boots.png`)} class="rounded-xl"/>
                            </div>
                            <div id="item-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_glimmer_cape.png`)} class="rounded-xl" 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>
                            <div id="item-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_magic_wand.png`)} 
                                onerror={(e) => e.target.classList = "hidden"}/>
                            </div>   
                        </div>
                        <div class="grid grid-cols-3 space-x-2">
                            <div id="item-slot4" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ward_dispenser.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot5" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_dust.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-slot6" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_ultimate_scepter.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                        </div>                 
                    </div>
                    <!-- backpack -->
                     <div class="relative grid grid-cols-3  gap-1 p-10 bottom-8.5 right-8">
                            <div id="item-backpack-slot1" class="bg-gray-900 rounded-xl">
                                <img alt="Daedalus" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot2" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_clarity.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                            <div id="item-backpack-slot3" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_null.png`)} class="rounded-xl grayscale"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>   
                    </div> 
                    <!-- TP slot -->
                    <div class="relative p-10 -top-40 left-50 w-[45%]">
                            <div id="item-tp-slot" class="bg-gray-900 rounded-xl">
                                <img alt="BKB" src={asset(`/resources/items/item_tpscroll.png`)} class="rounded-xl"
                                onerror={(e) => e.target.classList = "hidden"}
                                />
                            </div>
                             
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </div>