import { Injectable } from "@nestjs/common";
import { Department } from "src/infrastructure/orm/entities/departments.entity";
import { DepartmentRepository } from "src/infrastructure/orm/repositories/departments.repositories";

@Injectable()
export class DepartmentUseCase{
    constructor(
        private readonly departmentRepo:DepartmentRepository,
    ){}
    
    async createDepartment(dep : Partial<Department>):Promise<Department>{
        return this.departmentRepo.createDepartment(dep);
    }
}