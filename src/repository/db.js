import { Sequelize } from "sequelize";
 
import dotenv from 'dotenv'
dotenv.config()
 const POSTGRE_HOST = process.env.POSTGRE_HOST
 const POSTGRE_PORT = process.env.POSTGRE_PORT
 const POSTGRE_USERNAME = process.env.POSTGRE_USERNAME
 const POSTGRE_PASSWORD = process.env.POSTGRE_PASSWORD
 const POSTGRE_DATABASE = process.env.POSTGRE_DATABASE

const sequelize = new Sequelize({
    host:POSTGRE_HOST,
    port:POSTGRE_PORT,
    username:POSTGRE_USERNAME,
    password:POSTGRE_PASSWORD,
    database:POSTGRE_DATABASE,
    schema:"public",
    dialect:"postgres",
    logging:false
    //logging:console.log
});
export default sequelize;