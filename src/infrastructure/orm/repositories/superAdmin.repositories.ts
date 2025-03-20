import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SuperAdmin } from "../entities/superAdmin.entity";
import { Repository,In } from "typeorm";
import { ISuperAdmin } from "src/domain/models/superAdmin.entity.interface";

@Injectable()
export class SuperAdminRepository{
    constructor(
        @InjectRepository(SuperAdmin)
        private readonly superAdminRepo : Repository<SuperAdmin>,
    ){}

    async createUser(data: { name: string; email: string; password: string }): Promise<SuperAdmin> {
        const superAdmin = this.superAdminRepo.create(data);
        return await this.superAdminRepo.save(superAdmin);
      }

      async findOne(id: number) {
        return await this.superAdminRepo.findOne({
            where: { id },
            relations: ['organizations']
        });
    }

    async findById(id: number) {
        return this.superAdminRepo.findOne({ where: { id } });
    }

    async getAllSuperAdmins(): Promise<SuperAdmin[]> {
        return this.superAdminRepo.find({
            relations: ["organizations","departments","users"], 
        });
    }
    
     async getUserByEmail(email: string): Promise<SuperAdmin | null> {
            return await this.superAdminRepo.findOne({ 
                where: { email }, 
                
            });
        }
    
}