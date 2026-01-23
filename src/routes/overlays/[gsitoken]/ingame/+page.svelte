<script>
    import "$lib/assets/style/event_timing.css";
    import { slide, fade } from "svelte/transition";
    import { asset } from "$app/paths";
    import {  socket, formatTimeWithRoundedSecond,GENERIC_EVENT, FIRST_BLOOD} from '$lib/const/const'
    import {EVENT_ROSHAN_KILLED,EVENT_ITEM_PURCHASE} from  '$lib/const/const'
    import {items} from '$lib/const/item_ids'

    let item_purchased_overlay_visible = $state(false);
    
    let roshan_items_drop =$state(['item_aegis','black_image','black_image','black_image','black_image','black_image'])
    let player
    let hero
    
    let clock_time

    let notable_items =[29,116,139,147,65,141,145, 154,133,160,250,208]; // boots, bkb, butterfly, manta, midas, greater crit (daedalus), bfury, sny, rapier, skadi, abyssal
    
    let first_blood_flag = $state(false)
    let first_blood_overlay_visible = $state(false)
    let first_blood_drawer = $state('')

    let roshan_overlay_visible = $state(false);
    let roshan_alive = $state(false)
    let roshan_phase_remaining = $state(0)


    let item_overlay_data ={
        purchaser:"player name",
        hero:"",
        name:"",
        time:"0:00"
    }
    let item_has_purchased = $state(false)


    function toggle_show_item() {
        item_purchased_overlay_visible = !item_purchased_overlay_visible;
    }
    function toggle_show_roshan() {
        roshan_overlay_visible = !roshan_overlay_visible;
    }

    function toggle_show_firstblood() {
        first_blood_overlay_visible = !first_blood_overlay_visible;
    }


    socket.on('playersstate', (data)=>{
        if(data) player = data;
    })

    socket.on('gamestate:time',(data) =>{
            clock_time = data.clock_time
    })

    socket.on('heroesstate', (data)=>{
        if(data) hero = data;
    })


    let last_evt_data_history;
    socket.on('eventstate', (data) =>{
        if(data && data.length > 0){

            let last_event = data[0]
            if(last_event.event_type == GENERIC_EVENT){
                    let event_data = JSON.parse(last_event.data)
                    //to avoid redundant event which will show many times from event
                    if(event_data == last_evt_data_history) return;

                    if(event_data.type == EVENT_ITEM_PURCHASE){
                        //only show notable items (e.g bkb manta daedalus. ee notable items variable above)
                        if(notable_items.find((id) => id == event_data.value)){
                            if(!item_has_purchased){
                                item_overlay_data.name = 'item_' + items[event_data.value]                    
                                let playerKey = `player${event_data.playerid1}`;
                                item_overlay_data.purchaser = player[playerKey].name
                                item_overlay_data.hero = hero[playerKey].name.replaceAll('npc_dota_hero_','')
                                item_overlay_data.time = clock_time
                                item_has_purchased = true
                                item_purchased_overlay_visible = true;
                                setTimeout(() => {
                                    item_has_purchased = false;
                                    item_purchased_overlay_visible = false
                                }, 10000)
                            } 
                            last_evt_data_history = event_data;                          
                            return
                        }                
                    }
                    if(event_data.type == FIRST_BLOOD){
                        if(!first_blood_flag){
                            let playerKey = `player${event_data.playerid1}`;
                            first_blood_drawer = player[playerKey].name
                            first_blood_overlay_visible = true
                            setTimeout(() =>{ 
                                first_blood_flag = true
                                first_blood_overlay_visible = false
                            }, 5000)
                            return
                        }
                        else return
                    }
            }
        }
    })

    socket.on('roshanstate', (roshan) =>{
        // if(roshan && roshan.alive && roshan_sequence > 1){
        if(roshan && roshan.alive){
            if(roshan.items_drop){
                    Object.keys(roshan.items_drop).forEach((itemKey) =>{
                        roshan_items_drop[itemKey.slice(4)] = roshan.items_drop[itemKey]                    
                    })
            }
            roshan_alive =true        
            
        }
        else if(roshan && !roshan.alive){
            roshan_phase_remaining = roshan.phase_time_remaining
            roshan_alive =false
        }
    })

</script>

<!-- <button class="uppercase setting" onclick={toggle_show_item} >Show/Hide Item purchase overlay</button >
<button class="uppercase setting" onclick={toggle_show_roshan} >Show/Hide Roshan state overlay</button >
<button class="uppercase setting" onclick={toggle_show_firstblood} >Show/Hide first blood overlay</button > -->
{#if first_blood_overlay_visible}   
    <!-- First blood Timing -->
    <div transition:fade={{ duration: 100 }} id="firstblood_timing" class="items-center justify-items-center justify-center place-items-center top-15" >       
        <div transition:slide={{ duration: 1500, axis: "y", delay:500 }} class="w-[50%] h-[8%] p-5 place-content-start flex" >
            <div transition:fade={{ duration: 400, delay: 300 }} class="flex items-start place-content-start justify-start place-items-start w-full">
                <h1 class="flex-initial text-start text-red-700 mr-2">{first_blood_drawer} drew FIRST BLOOD !!!</h1>
                <div transition:fade={{ duration: 200, delay:1800 }} class="splash bg-red-900 w-[10%]">&nbsp;</div>
            </div>
        </div>
    </div>
{/if}
    
{#if item_purchased_overlay_visible}   
    <!-- Item Timing -->
    <div transition:fade={{ duration: 500 }} id="item_timing" class="justify-items-end justify-end place-items-start top-15 right-4 gap-1" >       
        <div transition:slide={{ duration: 1500, axis: "x" }} class=" bg-gray-500 w-[30%] h-[13%] p-5 place-content-start flex rounded-bl-lg rounded-tl-lg" >
            <div class="w-[22%] flex-none"> 
                <img src={asset(`/resources/items/${item_overlay_data.name}.png`)} alt="" class="w-30 h-25" />               
            </div>
            <div class="w-[22%] flex-none">
                <video autoplay muted loop class="w-30 h-25">
                    <source type="video/webm" src={asset(`/resources/picks/${item_overlay_data.hero}.webm`)} />
                </video>
            </div>
            <div transition:fade={{ duration: 500, delay: 500 }} class="flex-initial">
                <h1>{item_overlay_data.purchaser}</h1>
                <h1>{item_overlay_data.time}</h1>
            </div>
        </div>
    </div>
{/if}

    <!-- Roshan Timing -->
{#if roshan_overlay_visible}
 <div transition:fade={{ duration: 500 }} id="roshan_timing" class="justify-items-end justify-end place-items-start top-56 right-4 " > 
    <div transition:slide={{ duration: 1000, axis: "x" }} class="w-[30%] h-[30%] p-5 place-content-start flex rounded-bl-lg rounded-tl-lg bg-gray-500" >
    {#if roshan_alive}              
            <div class="w-[33%] flex-none"> 
                <img src={asset(`/resources/Roshan_model.webp`)} alt="Roshan" class="w-40 h-50" />
            </div>
            <div transition:fade={{ duration: 500, delay: 500 }} class="flex-initial">
                <h1>Roshan {formatTimeWithRoundedSecond(roshan_phase_remaining)}</h1>
                <div class="grid grid-cols-3 gap-1 p-4">
                        {#each  roshan_items_drop as item_drop }
                            <div class="roshan_slot border-4 border-zinc-900"><img src={asset(`/resources/items/{item_drop}.png`)} alt={item_drop} class="w-20 h-20" /></div>
                        {/each}
                </div>
            </div>
    {:else}       
            <div class="w-[33%] flex-none"> 
                 <img src={asset(`/resources/Roshan_model.webp`)} alt="Roshan" class="w-40 h-50" />
            </div>
            <div transition:fade={{ duration: 500, delay: 500 }} class="flex-initial">
                <h1>Next Roshan {formatTimeWithRoundedSecond(roshan_phase_remaining)}</h1>
                <div class="grid grid-cols-3 gap-1 p-4">
                        {#each  roshan_items_drop as item_drop }
                            <div class="roshan_slot border-4 border-zinc-900"><img src={asset(`/resources/items/{item_drop}.png`)} alt={item_drop} class="w-20 h-20" /></div>
                        {/each}
                </div>
            </div>

    {/if}
    </div>
</div>
{/if}
<style>
    .splash {
        mask-image: url("/resources/image_style/splash_mask.png");
        mask-size:  100%;
        mask-repeat: no-repeat;
        mask-position: center;
        background-repeat: no-repeat;
        filter: blur(20px) contrast(50);
        box-shadow: 0 0 5px #170202;
    }
</style>

