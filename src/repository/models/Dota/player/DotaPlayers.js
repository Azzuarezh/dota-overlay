import sequelize from '../../../db'
import { DataTypes, where } from "sequelize";
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

    },
     steamId:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isAlphanumeric:true
      }
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
        type:DataTypes.TEXT,
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

export async function createNewPlayer(accountId, steamId,name,rolePosition,avatarPicture){
 const createdPlayer = await DotaPlayers.create(
            {	accountId: accountId, 
                steamId: steamId,
                name: name,
                rolePosition:rolePosition,
                avatarPicture: avatarPicture
            },
        )
    if (createdPlayer === null) {
        throw new Error("Unexpected error");
    }
    return createdPlayer;
}
export default DotaPlayers;