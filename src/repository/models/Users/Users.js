import sequelize from '../../db'
import { DataTypes, where } from "sequelize";
import UserSessions from './UserSessions';
import UserGsiToken from './UserGsiToken';
import { hashPassword } from '../../../lib/server/util/password';

const Users = sequelize.define(
  'Users',
  {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    email:{
        type:DataTypes.TEXT,
        allowNull:false,
        unique: true,
        validate:{
            isEmail:true
        }
    },
    userName : {
        type:DataTypes.TEXT,
        allowNull:false,
        unique: true,
        validate:{
          is:{
            args:/^[a-zA-Z0-9_-]{3,16}$/,
            msg:"please provide a valid username (character or number) with minimum 3 and maximum 16"
          }

        }
    },
    password:{ 
        type:DataTypes.TEXT,
        allowNull:false
    },
    socketType:{
        type:DataTypes.STRING,
        // validate:{ isIn: [['user_socket', 'dota2_client_socket']],   }
    },
    isOnline:{ 
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:true
    },
    lastPing:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
  },
  {
    // Other model options go here
    timestamps:true,
    underscored:true,
    tableName:"users"
  },
);

Users.hasMany(UserGsiToken, {
  onDelete:'CASCADE',
  foreignKey: {
    name:'userId',
    field:'user_id'
  }
  }
) 
Users.hasMany(UserSessions, {
  onDelete:'CASCADE',
  foreignKey: {
    name:'userId',
    field:'user_id'
    }
  }
)


export async function createUser(firstName,lastName,email, userName, password) {
	const passwordHash = await hashPassword(password);
	const createdUser = await Users.create(
			{	firstName: firstName, 
				lastName: lastName,
				userName: userName,
				email: email,
				password:passwordHash,
				socketType:'user_socket',
			},
		)
	if (createdUser === null) {
		throw new Error("Unexpected error");
	}
	return createUser;
}

export async function getUserById(user_id) {
  return await Users.findOne({where:{id:user_id}});
}

export async function getUserByUserName(username) {
	return await Users.findOne({where:{userName:username}});
}

export async function getUserByUserEmail(email) {
	return await Users.findOne({where:{email:email}});
}

export async function setUserIsConnected(user_id){
  await Users.update( {
    isOnline:true, latPing:sequelize.fn('NOW')
  },
    {
      where:{
      id: user_id
    }
  })
}

sequelize.sync()
export default Users;