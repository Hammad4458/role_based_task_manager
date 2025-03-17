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

    async createSuperAdmin(user:Partial<ISuperAdmin>){
        if (!user || Object.keys(user).length === 0) {
            throw new Error('Super Admin data is missing');
          }
          const newUser = this.superAdminRepo.create(user);
          return await this.superAdminRepo.save(newUser);
    }

    async findByIds(ids: number[]) {
        return this.superAdminRepo.find({
            where: { id: In(ids) },
            relations:['organizations']
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
    
    
}