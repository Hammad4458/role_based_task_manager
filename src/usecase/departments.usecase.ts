import { Injectable } from "@nestjs/common";
import { Department } from "src/infrastructure/orm/entities/departments.entity";
import { User } from "src/infrastructure/orm/entities/users.entity";
import { DepartmentRepository } from "src/infrastructure/orm/repositories/departments.repositories";
import { UserRepository } from "src/infrastructure/orm/repositories/users.repositories";

@Injectable()
export class DepartmentUseCase{
    constructor(
        private readonly departmentRepo:DepartmentRepository,
    ){}
    
    async createDepartment(departmentData: { name: string; superAdmin: number; }) {
        return await this.departmentRepo.createDepartment(departmentData);
      }

    async getAllDepartments(): Promise<Department[]> {
        return this.departmentRepo.getAllDepartments();
    }

    async updateDepartmentName(orgId: number, name: string) {
        return this.departmentRepo.updateDepartmentName(orgId, name);
      }
    
}