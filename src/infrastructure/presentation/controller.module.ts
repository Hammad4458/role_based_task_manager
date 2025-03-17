import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "src/infrastructureUseCaseBridge/usecase.bridge.module";
import { SuperAdminController } from "./superAdmin/superAdmin.controller";
import { OrganizationController } from "./organizations/organizations.controller";
import { DepartmentController } from "./departments/departments.controller";
import { UserController } from "./users/users.controller";

@Module({
    imports:[UseCaseProxyModule.register()],
    controllers:[SuperAdminController,OrganizationController,DepartmentController,UserController]

})

export class ControllerModule{}