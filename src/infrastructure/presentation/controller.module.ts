import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "src/infrastructureUseCaseBridge/usecase.bridge.module";
import { SuperAdminController } from "./superAdmin/superAdmin.controller";

@Module({
    imports:[UseCaseProxyModule.register()],
    controllers:[SuperAdminController]

})

export class ControllerModule{}