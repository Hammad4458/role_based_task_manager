import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "../entities/organization.entity";
import { DatabaseOrmConfigModule } from "src/infrastructure/config/database.config";
import { SuperAdmin } from "../entities/superAdmin.entity";
import { Department } from "../entities/departments.entity";
import { User } from "../entities/users.entity";
import { Task } from "../entities/tasks.entity";
import { SuperAdminRepository } from "./users.repositories";

@Module({
    imports:[TypeOrmModule.forFeature([SuperAdmin,Organization,Department,User,Task]),DatabaseOrmConfigModule],
    providers:[SuperAdminRepository], //Repositories here
    exports:[SuperAdminRepository]
    
})

export class RepositoryModule{}