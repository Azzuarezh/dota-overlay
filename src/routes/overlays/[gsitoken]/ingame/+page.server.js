
import { env } from '$env/dynamic/private';
/** @type {import('./$types').PageServerLoad} */
export function load({params}) {
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
		BASE_URL:(env.BASE_URL)?env.BASE_URL:'http://localhost:3000',
		SOCKET_IO_URL:(env.SOCKET_IO_URL)?env.SOCKET_IO_URL:'http://localhost:3000'
	}
}