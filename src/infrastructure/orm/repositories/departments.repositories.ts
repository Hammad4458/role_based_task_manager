import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/departments.entity';
import { SuperAdminRepository } from './superAdmin.repositories';
import { IDepartmentRepository } from 'src/domain/repositories/departments.repo.interface';

@Injectable()
export class DepartmentRepository implements IDepartmentRepository{
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
    private readonly superAdminRepo: SuperAdminRepository,
  ) {}

  async createDepartment(departmentData: {
    name: string;
    superAdmin: number;
    organizations?: number[];
  }): Promise<Department> {
    const { name, superAdmin } = departmentData;
  
    if (!name) {
      throw new Error('Department name is required.');
    }
  
    const superAdminEntity = await this.superAdminRepo.findById(superAdmin);
    if (!superAdminEntity) {
      throw new Error(`SuperAdmin with ID ${superAdmin} not found.`);
    }
  
    let department = this.departmentRepo.create({
      name,
      superAdmin: superAdminEntity,
    });

    department = await this.departmentRepo.save(department);
  
    const savedDepartment = await this.departmentRepo.findOne({
      where: { id: department.id },
      relations: ['superAdmin'],
    });

    if (!savedDepartment) {
      throw new Error('Failed to create department.');
    }

    return savedDepartment; 
  }

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentRepo.find({
      relations: ['superAdmin', 'organizations', 'users'],
    });
  }

   async updateDepartmentName(orgId: number, name: string): Promise<Department> {
          const department = await this.departmentRepo.findOne({ where: { id: orgId } });
          if (!department) {
            throw new Error('Department not found');
          }
      
          department.name = name;
          return this.departmentRepo.save(department);
        }
}
