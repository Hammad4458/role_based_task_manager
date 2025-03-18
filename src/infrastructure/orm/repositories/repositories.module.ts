import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "../entities/organization.entity";
import { DatabaseOrmConfigModule } from "src/infrastructure/config/database.config";
import { SuperAdmin } from "../entities/superAdmin.entity";
import { Department } from "../entities/departments.entity";
import { User } from "../entities/users.entity";
import { Task } from "../entities/tasks.entity";
import { SuperAdminRepository } from "./superAdmin.repositories";
import { OrganizationRepository } from "./organizations.repositories";
import { DepartmentRepository } from "./departments.repositories";
import { UserRepository } from "./users.repositories";
import { TaskRepository } from "./tasks.repositories";


@Module({
    imports:[TypeOrmModule.forFeature([SuperAdmin,Organization,Department,User,Task]),DatabaseOrmConfigModule],
    providers:[SuperAdminRepository,OrganizationRepository,DepartmentRepository,UserRepository,TaskRepository], 
    exports:[SuperAdminRepository,OrganizationRepository,DepartmentRepository,UserRepository,TaskRepository]
    
})

export class RepositoryModule{}