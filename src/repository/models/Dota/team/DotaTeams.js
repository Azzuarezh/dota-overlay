import sequelize from '../../../db'
import { DataTypes, where } from "sequelize";

const DotaTeams = sequelize.define(
  'DotaTeams',
  {
    teamId:{
        type: DataTypes.INTEGER,
        unique:true,
        primaryKey:true,
        allowNull:false,
        validate:{
          len:[0,7]
        }
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,

    },
     tag:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    logo:{
      type:DataTypes.BLOB('medium'),
    }
  },
  {
    // Other model options go here
    timestamps:true,
    underscored:true,
    tableName:"dota_team"
  },
);


export async function getDotaTeams(){
  return await DotaTeams.findAll()
}

export async function getDotaTeamByTeamId(team_id){
return await DotaTeams.findOne({ where:{teamId:team_id}});
}

export async function getDotaTeamIdAndNamesAndTag(){
  return await DotaTeams.findAll({attributes:['teamId','name','tag']})
}

export async function createDotaTeam(team_id,teamName,teamTag ) {
    const createdTeam = await DotaTeams.create(
            {	
              teamId:team_id,  
              name: teamName, 
              tag: teamTag
            },
        )
    if (createdTeam === null) {
        throw new Error("Unexpected error");
    }
    return createdTeam;
}
export async function updateTeam(teamObject){
   const teamId = teamObject.id;
      //exclude the id for set the data. the id is only for where syntax
      delete teamObject.id;
      const updatedTeam = await DotaTeams.update(teamObject,
          {
          where:{
            teamId: teamId
          }
       })
      if (updatedTeam === null) {
          throw new Error("Unexpected error");
      }
      return updateTeam;
}

export async function updateTeamLogo(team_id, teamLogoFile){
  const updatedTeam = await DotaTeams.update(
        {logo: teamLogoFile},
        {
          where:{
            teamId: team_id
          }
        })

  if(updatedTeam === null) throw new Error("unexpected error")
  return updatedTeam;
}


export default DotaTeams;