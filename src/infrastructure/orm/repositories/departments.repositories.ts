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
    superAdminIds: number[]; // ✅ Now an array
    organizationIds: number[];
  }) {
    const { name, superAdminIds, organizationIds } = departmentData;
  
    if (!name || !Array.isArray(superAdminIds) || superAdminIds.length === 0 || !Array.isArray(organizationIds) || organizationIds.length === 0) {
      throw new Error('Department name, at least one SuperAdmin ID, and at least one Organization ID are required.');
    }
  
    // Fetch multiple SuperAdmins
    const superAdmins = await this.superAdminRepo.findByIds(superAdminIds);
    if (superAdmins.length !== superAdminIds.length) {
      throw new Error('One or more SuperAdmin IDs are invalid.');
    }
  
    // Fetch Organizations
    const organizations = await this.organizationRepo.findByIds(organizationIds);
    if (organizations.length !== organizationIds.length) {
      throw new Error('One or more Organization IDs are invalid.');
    }
  
    // Check if department already exists
    let department = await this.departmentRepo.findOne({ where: { name }, relations: ['superAdmin', 'organizations'] });
  
    if (department) {
      // Update existing department
      department.superAdmin = superAdmins; // ✅ Now an array
      await this.departmentRepo.save(department);
  
      // Update associated organizations
      await this.departmentRepo
        .createQueryBuilder()
        .relation(Department, 'organizations')
        .of(department)
        .addAndRemove(organizations, department.organizations || []);
    } else {
      // Create and save new department
      department = this.departmentRepo.create({ name, superAdmin: superAdmins }); // ✅ Now an array
      department = await this.departmentRepo.save(department);
  
      // Associate multiple Organizations with the Department
      await this.departmentRepo
        .createQueryBuilder()
        .relation(Department, 'organizations')
        .of(department)
        .add(organizations);
    }
  
    // Reload the department to include relations
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
