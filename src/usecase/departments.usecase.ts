import { Injectable } from "@nestjs/common";
import { Department } from "src/infrastructure/orm/entities/departments.entity";
import { DepartmentRepository } from "src/infrastructure/orm/repositories/departments.repositories";

@Injectable()
export class DepartmentUseCase{
    constructor(
        private readonly departmentRepo:DepartmentRepository,
    ){}
    
    async createDepartment(departmentData: { name: string; superAdminIds: number; organizationIds: number[] }) {
        return await this.departmentRepo.createDepartment(departmentData);
      }

    async getAllDepartments(): Promise<Department[]> {
        return this.departmentRepo.getAllDepartments();
    }
}