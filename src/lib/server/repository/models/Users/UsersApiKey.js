import sequelize from '../../db'
import { DataTypes } from "sequelize";
const UsersApiKey = sequelize.define(
  'UsersApiKey',
  {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },
    apiKey:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
    },
     usage:{
        type: DataTypes.STRING,
        allowNull:true,
        validate:{
          isIn:[['GAMESTATE_INTEGRATION','OTHER']]
        }
    }
  },
  {
    // Other model options go here
    timestamps:true,
    underscored:true,
    tableName:"user_api_keys"
  },
);
export default UsersApiKey;