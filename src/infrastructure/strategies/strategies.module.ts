import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { UseCaseProxyModule } from "src/infrastructureUseCaseBridge/usecase.bridge.module";
import { PassportModule } from "@nestjs/passport";
import { JwtService } from "../services/jwt/jwt.service";
import { ConfigService } from "@nestjs/config";

@Module({
    imports:[UseCaseProxyModule.register(),PassportModule],
    providers: [JwtStrategy,JwtService,ConfigService],
    exports:[JwtStrategy,JwtService]
    
})

export class strategyModule{};