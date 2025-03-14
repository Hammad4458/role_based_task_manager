import {  Injectable } from "@nestjs/common";
import { SuperAdmin } from "src/infrastructure/orm/entities/superAdmin.entity";
import { SuperAdminRepository } from "src/infrastructure/orm/repositories/users.repositories";

@Injectable()
export class SuperAdminUseCase{
    constructor(
        private readonly superAdminRepo:SuperAdminRepository,
    ){}

    async createSuperAdmin(user : Partial<SuperAdmin>): Promise<SuperAdmin> {
       
        return await this.superAdminRepo.createSuperAdmin(user);
    }
}