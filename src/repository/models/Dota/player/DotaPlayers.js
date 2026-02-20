import sequelize from '../../../db'
import { DataTypes, where } from "sequelize";
import DotaTeams from '../team/DotaTeams';
const DotaPlayers = sequelize.define(
  'DotaPlayer',
  {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },
    accountId:{
        type:DataTypes.INTEGER,
        unique:true,
        allowNull:false,
        validate:{
            isNumeric:true,
            len:[0,9]
        }

    },
     steamId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isNumeric:true,
            len:[0,17]
        }

    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    rolePosition:{
        type:DataTypes.INTEGER,
        allowNull:true,
        validate:{
            min: 1,
            max: 5,  
        }
    },
    avatarPicture:{
        type:DataTypes.BLOB('medium'),
        allowNull:true
    }
  },
  {
    // Other model options go here
    timestamps:true,
    underscored:true,
    tableName:"dota_player"
  },
);

export async function findDotaPlayers(){
  return await DotaPlayers.findAll({include:[{model:DotaTeams, as:'team'}]})
}

export async function getPlayerByPlayerId(playerId){
    return await DotaPlayers.findOne({include:[{model:DotaTeams, as:'team'}], where:{id:playerId}});
}

export async function getPlayerBySteamId(steam_id) {
  return await DotaPlayers.findOne({include:[{model:DotaTeams, as:'team'}], where:{steamId:steam_id}});
}

export async function getPlayerByAccountId(account_id) {
  return await DotaPlayers.findOne({include:[{model:DotaTeams, as:'team'}], where:{accountId:account_id}});
}

export async function getPlayersByTeamId(teamId){
    return await DotaPlayers.findAll({order:[['rolePosition','ASC']], where:{teamId:teamId}})
}


export async function createNewPlayer(playerObject){
 const createdPlayer = await DotaPlayers.create(playerObject)
    if (createdPlayer === null) {
        throw new Error("Unexpected error");
    }
    return createdPlayer;
}

export async function updatePlayer(playerObject){
    const playerId = playerObject.id;
    //exclude the id for set the data. the id is only for where syntax
    delete playerObject.id;
    const updatedPlayer = await DotaPlayers.update(playerObject,
        {
        where:{
          id: playerId
        }
     })
    if (updatedPlayer === null) {
        throw new Error("Unexpected error");
    }
    return updatedPlayer;
}

export async function assignTeam(playerId, teamId){
    //exclude the id for set the data. the id is only for where syntax
    //const player = await DotaPlayers.findOne({where:{id:playerId}});
    //console.log('player:', player)
    //console.log('dota team id :', player.DotaTeamId)
    const updatedPlayer = await DotaPlayers.update({DotaTeamId : teamId},
        {
        where:{
          id: playerId
        }
     })
    if (updatedPlayer === null) {
        throw new Error("Unexpected error");
    }
    return updatedPlayer;
}

export async function updateAvatar(playerId,avatarFile){

    const updatedPlayer = await DotaPlayers.update(
        {
            avatarPicture: avatarFile
        },
        {
        where:{
          id: playerId
        }
     })
    if (updatedPlayer === null) {
        throw new Error("Unexpected error");
    }
    return updatedPlayer;
}

export default DotaPlayers;