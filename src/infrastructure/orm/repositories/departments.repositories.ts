import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Department } from '../entities/departments.entity';
import { SuperAdminRepository } from './superAdmin.repositories';
import { OrganizationRepository } from './organizations.repositories';

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
    superAdminIds: number; 
    organizationIds: number[];
  }) {
    const { name, superAdminIds, organizationIds } = departmentData;
  
    if (!name) {
      throw new Error('Department name is required.');
    }
  
    // ✅ Fetch and validate organizations
    const organizations = await this.organizationRepo.findByIds(organizationIds);
    if (organizations.length !== organizationIds.length) {
      throw new Error(
        `Some organization IDs do not exist. Found: ${organizations.map(o => o.id)}`
      );
    }
  
    // ✅ Fetch and validate SuperAdmin (expecting only one)
    const superAdmins = await this.superAdminRepo.findByIds([superAdminIds]); // Wrap it in an array
    if (superAdmins.length !== 1) {
      throw new Error(`SuperAdmin with ID ${superAdminIds} not found.`);
    }
    const superAdmin = superAdmins[0]; // Extract single SuperAdmin
  
    // ✅ Create department first (without relations)
    let department = this.departmentRepo.create({ name, superAdmin });
    department = await this.departmentRepo.save(department);
  
    // ✅ Now add organizations and save again
    department.organizations = organizations;
  
    await this.departmentRepo.save(department);
  
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
