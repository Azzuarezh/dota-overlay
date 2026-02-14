<script>
    import "$lib/assets/style/event_timing.css";
    import { slide, fade } from "svelte/transition";
    import { asset } from "$app/paths";
    import {
        formatTimeWithRoundedSecond,
        GENERIC_EVENT,
        FIRST_BLOOD,
    } from "$lib/const/const";
    import { EVENT_ROSHAN_KILLED, EVENT_ITEM_PURCHASE } from "$lib/const/const";
    import { items } from "$lib/const/item_ids";
    import io from "socket.io-client";
    
    /** @type {import('./$types').PageProps} */
    let { data } = $props()
    //console.log('data :', data)
    const overlaySocket = io('http://localhost:3000', {auth:{client_type:'overlay_client', token:data.gsi_token}})

    

    let item_purchased_overlay_visible = $state(false);

    let roshan_items_drop = $state([
        "item_null",
        "item_null",
        "item_null",
        "item_null",
        "item_null",
        "item_null",
    ]);
    let player;
    let hero;

    let clock_time;

    let notable_items = data.notable_items; // boots, bkb, butterfly, manta, midas, greater crit (daedalus), bfury, sny, rapier, skadi, abyssal

    let first_blood_flag = $state(false);
    let first_blood_overlay_visible = $state(false);
    let first_blood_drawer = $state("");

    //let roshan_overlay_visible = $state(false);

    let roshan_overlay_visible = $state(data.roshan_overlay_visible)
    let roshan_alive = $state(false);
    let roshan_phase_remaining = $state(0);

    let item_overlay_data = {
        purchaser: "player name",
        hero: "",
        name: "",
        time: "0:00",
    };
    let item_has_purchased = $state(false);

    function toggle_show_item() {
        item_purchased_overlay_visible = !item_purchased_overlay_visible;
    }
    function toggle_show_roshan() {
        roshan_overlay_visible = !roshan_overlay_visible;
    }

    function toggle_show_firstblood() {
        first_blood_overlay_visible = !first_blood_overlay_visible;
    }

    overlaySocket.on("playersstate", (data) => {
        if (data) player = data;
    });

    overlaySocket.on("gamestate:time", (data) => {
        clock_time = data.clock_time;
    });

    overlaySocket.on("heroesstate", (data) => {
        if (data) hero = data;
    });

    let last_evt_data_history;

    overlaySocket.on("eventstate", (data) => {
        if (data && data.length > 0) {
            let last_event = data[0];
            if (last_event.event_type == GENERIC_EVENT) {
                let event_data = JSON.parse(last_event.data);
                //to avoid redundant event which will show many times from event
                if (event_data == last_evt_data_history) return;

                if (event_data.type == EVENT_ITEM_PURCHASE) {
                    //only show notable items (e.g bkb manta daedalus. ee notable items variable above)
                    if (notable_items.find((id) => id == event_data.value)) {
                        if (!item_has_purchased) {
                            item_overlay_data.name =
                                "item_" + items[event_data.value];
                            let playerKey = `player${event_data.playerid1}`;
                            item_overlay_data.purchaser =
                                player[playerKey].name;
                            item_overlay_data.hero = hero[
                                playerKey
                            ].name.replaceAll("npc_dota_hero_", "");
                            item_overlay_data.time = clock_time;
                            item_has_purchased = true;
                            item_purchased_overlay_visible = true;
                            setTimeout(() => {
                                item_has_purchased = false;
                                item_purchased_overlay_visible = false;
                            }, 10000);
                        }
                        last_evt_data_history = event_data;
                        return;
                    }
                }
                if (event_data.type == FIRST_BLOOD) {
                    if (!first_blood_flag) {
                        let playerKey = `player${event_data.playerid1}`;
                        first_blood_drawer = player[playerKey].name;
                        first_blood_overlay_visible = true;
                        setTimeout(() => {
                            first_blood_flag = true;
                            first_blood_overlay_visible = false;
                        }, 5000);
                        return;
                    } else return;
                }
            }
        }
    });

    overlaySocket.on('settings:toggle_show_roshan',() =>{
        if(!roshan_overlay_visible){
             toggle_show_roshan()
             setTimeout(() => {
                roshan_overlay_visible = false;
            }, 5000) 
        }
    })

    overlaySocket.on("roshanstate", (roshan) => {
        // if(roshan && roshan.alive && roshan_sequence > 1){
        if (roshan && roshan.alive) {
            if (roshan.items_drop) {
                Object.keys(roshan.items_drop).forEach((itemKey) => {
                    roshan_items_drop[itemKey.slice(4)] =roshan.items_drop[itemKey]; //slicing to get item0,item1 or etc...
                });
            }
            roshan_alive = true;
        } else if (roshan && !roshan.alive) {
            roshan_phase_remaining = roshan.phase_time_remaining;
            roshan_alive = false;
        }
    });



</script>
<!-- <button class="uppercase setting" onclick={toggle_show_item} >Show/Hide Item purchase overlay</button >

<button class="uppercase setting" onclick={toggle_show_firstblood} >Show/Hide first blood overlay</button > -->
<!-- {#if first_blood_overlay_visible}   
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
{/if} -->


{#if roshan_overlay_visible}
<div transition:fade={{ duration: 500 }}  id="roshan_timing" class="justify-items-end justify-end place-items-start top-46 left-320">
    <div transition:slide={{ duration: 1500, axis: "x" }} class="grid grid-cols-2 w-full gap-4"
         class:hidden={!roshan_alive}>
         <div class="roshan p-5 flex flex-row space-x-2 place-content-start rounded-bl-lg rounded-tl-lg ">
        <!-- Roshan Alive -->
        <div  class="basis-50 place-content-center justify-items-center-safe rounded-l">
            <video
                autoplay
                muted
                loop
                class="items-center rounded-xl scale-[500%]"
            >
                <source
                    type="video/webm"
                    src={asset(`/resources/roshan_animation.webm`)}
                />
            </video>
        </div>
        <div class="wrapper">
            <!-- roshan item -->
            <div
                class="basis-80 bg-gray-800/50 grid grid-rows-2 space-y-1 rounded-lg p-4"
            >
            <div class="grid grid-cols-3 space-x-2">
                <div id="item-slot0" class="bg-gray-800 rounded-xl">
                    <img
                        alt="BKB"
                        src={asset(`/resources/items/${roshan_items_drop[0]}.png`)}
                        class="rounded-xl"
                    />
                </div>
                <div id="item-slot2" class="bg-gray-900 rounded-xl">
                    <img
                        alt="BKB"
                         src={asset(`/resources/items/${roshan_items_drop[1]}.png`)}
                        class="rounded-xl"
                        onerror={(e) => (e.target.classList = "hidden")}
                    />
                </div>
                <div id="item-slot3" class="bg-gray-900 rounded-xl">
                    <img
                        alt="BKB"
                        src={asset(`/resources/items/${roshan_items_drop[2]}.png`)}
                        onerror={(e) => (e.target.classList = "hidden")}
                    />
                </div>
            </div>
                <div class="grid grid-cols-3 space-x-2">
                    <div id="item-slot4" class="bg-gray-900 rounded-xl">
                        <img
                            alt="BKB"
                            src={asset(`/resources/items/${roshan_items_drop[3]}.png`)}
                            class="rounded-xl"
                            onerror={(e) => (e.target.classList = "hidden")}
                        />
                    </div>
                    <div id="item-slot5" class="bg-gray-900 rounded-xl">
                        <img
                            alt="BKB"
                            src={asset(`/resources/items/${roshan_items_drop[4]}.png`)}
                            class="rounded-xl"
                            onerror={(e) => (e.target.classList = "hidden")}
                        />
                    </div>
                    <div id="item-slot6" class="bg-gray-900 rounded-xl">
                        <img
                            alt="BKB"
                            src={asset(`/resources/items/${roshan_items_drop[5]}.png`)}
                            class="rounded-xl"
                            onerror={(e) => (e.target.classList = "hidden")}
                        />
                    </div>
                </div> 
            </div>
        </div>
    </div>
    </div>
    <div class="grid grid-cols-2 w-full gap-4"
        class:hidden={roshan_alive}>
         <div class="roshan p-5 flex flex-row space-x-2 place-content-start rounded-bl-lg rounded-tl-lg ">
        <!-- Roshan Cooldown -->
        <div  class="basis-50 place-content-center justify-items-center-safe rounded-l">
            <video
                autoplay
                muted
                loop
                class="items-center rounded-xl scale-[500%]"
            >
                <source
                    type="video/webm"
                    src={asset(`/resources/roshan_animation.webm`)}
                />
            </video>
        </div>
        <div class="wrapper">
            <!-- roshan Cooldown text -->
                         <div class="w-full h-[60%] place-items-center place-content-center">
                            <h1 class="text-amber-600 font-[radiance] text-4xl font-extrabold">Roshan Respawn at: {formatTimeWithRoundedSecond(roshan_phase_remaining)}</h1>              
                        </div>
        </div>
    </div>
    </div>

</div>
{/if}

<div id="player-portrait" class="fixed bottom-97 left-79 place-content-end place-items-start ">
 <img src={asset(`/resources/image_style/esport_player_portrait.jpg`) } 
    alt="player 1"
    class="rounded-xl w-46 h-40"
    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
</div>
<div id="player-name" class="fixed w-[11.5rem] bottom-98 left-79 h-7 place-content-end place-items-center rounded-lg bg-gray-200 p-0.5">
    <h1 class="text-md font-[radiance] font-extrabold truncate text-gray-900 text-center">Selected Player</h1>
</div>
<div id="sponsor" class="fixed w-[1280px] bottom-97 left-86 place-content-end place-items-end">
 <img src={asset(`/resources/image_style/sponsor_banner.png`) } 
    alt="player 1"
    class="rounded-xl w-54 h-40"
    onerror={(e) => e.target.src = asset(`/resources/image_style/esport_player_portrait.jpg`)}/>
</div>
<!-- this div below is just for guide to place the overlay over the ingame screen -->
<!-- <div class="guide fixed top-0 h-[1080px] w-full"></div>  -->


<style>
    /* .guide {
            background-image: url('/resources/ingame-overlay-guide.png');
            background-repeat: no-repeat;
            opacity: 0.5;
            border-width: 4px;
            border-color:red;
    } */
</style>