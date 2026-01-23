
/** @type {import('./$types').PageData} */
export function load({params}) {
	return{
	gsi_token:params.gsitoken,
	draft_active_time_remaining: 0,
	radiant_bonus_time:0,
	dire_bonus_time:0,
	active_team:'',
	phase:'',
	radiant_state:'',
	dire_state:'',
	series_type:'bo3',
	series_description:'',
	draft_ended:false,
	turn:'',
	radiant_team_info:{ tag:'RAD', name:'radiant', series_wins:0 },
	dire_team_info:{ tag:'DIR',name:'dire', series_wins:0 },
	//choosen mean a player choose the hero (after the draft state)
	radiant_choosen_heroes:[{ name: "", played_by: "" }, { name: "", played_by: "" }, { name: "", played_by: "" }, { name: "", played_by: "" }, { name: "", played_by: "" }],
	dire_choosen_heroes:[{ name: "", played_by: "" }, { name: "", played_by: "" }, { name: "", played_by: "" }, { name: "", played_by: "" }, { name: "", played_by: "" }],
	//picked mean a team pick the hero (on the draft state). same as banned hero
	radiant_picked_heroes: ['none', 'none', 'none', 'none', 'none'],
	dire_picked_heroes: ['none', 'none', 'none', 'none', 'none'],
	radiant_banned_heroes:['none', 'none', 'none', 'none', 'none', 'none', 'none'],
	dire_banned_heroes:['none', 'none', 'none', 'none', 'none', 'none', 'none'],
	setting_override:false, //we can override setting from dashboard
	toggle_pause_music:true,
	announced_picked_hero:'',
	popup_visible:false,
	picking_order:[],
	current_team_pick:'none',
	watch_index:0, 
	}
}