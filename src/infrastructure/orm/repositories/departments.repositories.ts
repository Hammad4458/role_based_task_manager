import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/departments.entity';
import { SuperAdminRepository } from './superAdmin.repositories';
import { OrganizationRepository } from './organizations.repositories';
import { User, UserRole } from '../entities/users.entity';
import { UserRepository } from './users.repositories';

@Injectable()
export class DepartmentRepository {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
    private readonly superAdminRepo: SuperAdminRepository,
    private readonly organizationRepo: OrganizationRepository,
  ) {}

  async createDepartment(departmentData: {
    name: string;
    superAdmin: number; 
    organizations: number[];
  }) {
    const { name, superAdmin, organizations } = departmentData;
  
    if (!name) {
      throw new Error('Department name is required.');
    }
  
    // ✅ Fetch and validate organizations
    const organizationEntities = await this.organizationRepo.findByIds(organizations);
    if (organizationEntities.length !== organizations.length) {
      throw new Error(
        `Some organization IDs do not exist. Found: ${organizationEntities.map(o => o.id)}`
      );
    }
  
    // ✅ Fetch and validate SuperAdmin
    const superAdminEntity = await this.superAdminRepo.findById(superAdmin);
    if (!superAdminEntity) {
      throw new Error(`SuperAdmin with ID ${superAdmin} not found.`);
    }
  
    // ✅ Create department
    let department = this.departmentRepo.create({
      name,
      superAdmin: superAdminEntity,
      organizations: organizationEntities,
    });

    department = await this.departmentRepo.save(department);
  
    return this.departmentRepo.findOne({
      where: { id: department.id },
      relations: ['superAdmin', 'organizations'],
    });
  }
  
 

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentRepo.find({
      relations: ['superAdmin', 'organizations', 'users'],
    });
  }
}
