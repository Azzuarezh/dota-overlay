import sequelize from '../../db'
import { DataTypes } from "sequelize";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

const UserSessions = sequelize.define(
  'UserSessions',
  {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    sessionToken:{ 
        type:DataTypes.TEXT,
    },
    expiredAt:{
        type: DataTypes.DATE,
    }
  },
  {
    timestamps:true,
    underscored:true,
    tableName:"user_sessions"
  },
);

export function generateSessionToken() {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export async function createSessionToDb(token,userId, expiredAt){
  UserSessions.create({
    sessionToken: token, 
    expiredAt:Math.floor(expiredAt.getTime() / 1000),
    userId: userId
  })
}

export default UserSessions;