import sequelize from '../../db'
import { DataTypes,} from "sequelize";
const UsersGsiToken = sequelize.define(
  'UsersGsiToken',
  {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isAlphanumeric:true
      }
    },
    token:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
    }
  },
  {
    // Other model options go here
    timestamps:true,
    underscored:true,
    tableName:"user_gsi_tokens"
  },
);



export async function createGsiToken(userId, tokenName){
 const token = await UsersGsiToken.create({
    name: tokenName, 
    userId: userId
  })
  return token.toJSON()
}

export async function updateGsiToken( tokenName, tokenValue){
 const token = await findGsiTokenByValue(tokenValue)
 if(token === null){
   return null
 }
 token.name = tokenName
 if(token!== null){
   await token.save()
   return token.toJSON()
 }
}




export async function findGsiTokenByUserId(user_id){
  return await UsersGsiToken.findAll({where:{ userId: user_id}})
}

export async function findGsiTokenById(tokenId){
  return await UsersGsiToken.findOne({where:{ id: tokenId}})
}


export async function findGsiTokenByValue(requestToken){
  return await UsersGsiToken.findOne({where:{ token: requestToken}})
}

export async function deleteGsiTokenById(tokenId){
  return await UsersGsiToken.destroy({where:{ id: tokenId}})
}

export async function deleteGsiTokenByValue(requestToken){
  return await UsersGsiToken.destroy({where:{ token: requestToken}})
}

export default UsersGsiToken;