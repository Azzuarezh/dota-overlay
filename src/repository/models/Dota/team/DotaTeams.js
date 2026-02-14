import sequelize from '../../../db'
import { DataTypes, where } from "sequelize";

const DotaTeams = sequelize.define(
  'DotaTeams',
  {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },
    name:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },
     tag:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    logo:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isAlphanumeric:true
      }
    }
  },
  {
    // Other model options go here
    timestamps:true,
    underscored:true,
    tableName:"dota_team"
  },
);


export async function createTeam(teamName,teamTag,logo, ) {
    const createdTeam = await DotaTeams.create(
            {	name: teamName, 
                tag: teamTag,
                logo: logo
            },
        )
    if (createdTeam === null) {
        throw new Error("Unexpected error");
    }
    return createdTeam;
}

export default DotaTeams;