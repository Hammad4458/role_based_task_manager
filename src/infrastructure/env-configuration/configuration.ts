import { registerAs } from "@nestjs/config";

const DatabaseConfig = registerAs('databae',()=>({

    host: process.env.HOST,
    port: process.env.PORT,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database:process.env.DATABASE,
    type:process.env.TYPE
}));
const JwtConfig = registerAs('jwtConfig', ()=>({
    key: process.env.SECRET_KEY
  }))

  export default [DatabaseConfig,JwtConfig];