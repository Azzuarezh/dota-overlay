/** @type {import('./player/$types').PageServerLoad} */
import {findDotaPlayers} from '../../../repository/models/Dota/player/DotaPlayers';
import {getDotaTeams} from '../../../repository/models/Dota/team/DotaTeams';
export async function load({ params,depends }) {
	const players = await findDotaPlayers();
	const teams = await getDotaTeams()
	teams.forEach(team =>{
		if(team.logo != null) team.logo = team.logo.toString('base64')
	})
	depends('player-and-team:list')
	return {
		players: JSON.parse(JSON.stringify(players)),
		teams:JSON.parse(JSON.stringify(teams))
	};
}

