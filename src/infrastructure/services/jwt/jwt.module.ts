import { Module } from "@nestjs/common";
import {JwtModule as NestJwtModule } from "@nestjs/jwt";
import { JwtService } from "./jwt.service";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/infrastructure/strategies/jwt.strategy";

@Module({
    imports:[NestJwtModule.register({}),PassportModule],
    providers:[JwtService,JwtStrategy],
    exports:[JwtService,JwtStrategy],
    
})

export class JwtModule{};