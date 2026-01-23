import sequelize from '../../db'
import { DataTypes } from "sequelize";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
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

export async function getSessionByToken(token){
  return await UserSessions.findOne({where:{sessionToken:token}})
}

export function generateSessionToken() {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export async function createSessionToDb(token,userId, expiredAt){
  UserSessions.create({
    sessionToken: token, 
    expiredAt: expiredAt,
    userId: userId
  })
}

export function setSessionTokenCookie(event, token, expiredAt) {
    event.cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        expires: expiredAt
    });
   
}

export function deleteSessionTokenCookie(event) {
	event.cookies.set("session", "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}



export async function validateSessionToken(token) {
  const session = await UserSessions.findOne({
      where:{sessionToken:token},     
    }
  )

	if (session === null) {
		return null;
	}
	if (Date.now() >= session.expiredAt.getTime()) {
    await UserSessions.destroy({where:{sessionToken: token}})
		return session;
	}
	if (Date.now() >= session.expiredAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await UserSessions.update(
      {expiredAt : Math.floor(session.expiredAt.getTime() / 1000)},
      {where:
        {
          sessionToken:token
        }
      })

	}
	return session;
}

export async function invalidateSession(token){
	 await UserSessions.destroy({where:{sessionToken: token}})
}

export async function invalidateUserSessions(user_id){
	 await UserSessions.destroy({where:{userId: user_id}})
}

export default UserSessions;