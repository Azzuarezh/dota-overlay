import {getDotaTeams} from '../../../../repository/models/Dota/team/DotaTeams'
import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {

	let dotaTeams = await getDotaTeams()
	dotaTeams.forEach(t =>{
		if(t.logo != null) t.logo = t.logo.toString('base64');
	})
	return{
		gsi_token:params.gsitoken,
		roshan_overlay_visible: false,
		notable_items :[
			29, 116, 139, 147, 65, 141, 145, 154, 133, 160, 250, 208,
		],
		player0:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		player1:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		player2:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		player3:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		player4:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		player5:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		player6:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		player7:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		player8:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		player9:{accountId:null,name:null,avatarPicture:null,isExistInDb:false, alreadyMounted:false},
		team_list: JSON.parse(JSON.stringify(dotaTeams)),
		radiant_team_info:{ tag:'RAD', name:'radiant', logo:'/resources/image_style/default_team_logo.png', default:true},
		dire_team_info:{ tag:'DIR',name:'dire', logo:'/resources/image_style/default_team_logo.png',default:true},
		BASE_URL:(env.BASE_URL)?env.BASE_URL:'http://localhost:3000',
		SOCKET_IO_URL:(env.SOCKET_IO_URL)?env.SOCKET_IO_URL:'http://localhost:3000'
	}
}