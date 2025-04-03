import { registerAs } from "@nestjs/config";

const DatabaseConfig = registerAs('database', ()=>({   
    type: process.env.TYPE || 'postgres',             
    host: process.env.HOST,
    port: Number(process.env.PORT),                   
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}));

const JwtConfig = registerAs('jwtConfig', ()=>({
    key: process.env.SECRET_KEY,
    refreshKey: process.env.REFRESH_KEY
}));

export default [DatabaseConfig, JwtConfig];
