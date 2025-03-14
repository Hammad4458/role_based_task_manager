import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Department } from "../entities/departments.entity";
import { IDepartment } from "src/domain/models/departments.entity.interface";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class DepartmentRepository{
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepo:Repository<Department>,
    ){}

    async createDepartment(department : Partial<IDepartment>){
        if(!department || Object.keys(department).length==0){
            throw new Error("Department Data is Missing");
        }
        const newDepartment= this.departmentRepo.create(department);
        return await this.departmentRepo.save(newDepartment);
    }
}