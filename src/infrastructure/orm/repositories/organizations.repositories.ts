import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Organization } from "../entities/organization.entity"; 
import { SuperAdminRepository } from "./superAdmin.repositories";
import { DepartmentRepository } from "./departments.repositories";
import { Department } from "../entities/departments.entity";
import { User } from "../entities/users.entity";
import { IOrganizationRepository } from "src/domain/repositories/organizations.repo.interface";

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepo: Repository<Organization>,
        @InjectRepository(Department)
            private readonly departmentRepo: Repository<Department>,
            @InjectRepository(Department)
            private readonly userRepo: Repository<User>,
        private readonly superAdminRepo: SuperAdminRepository, 
    ) {}

    async createOrganization(organizationData: { name: string; superAdmin: number }) {
        const { name, superAdmin } = organizationData;
    
        if (!name || !superAdmin ) {
            throw new Error("Organization name and at least one SuperAdmin ID are required.");
        }
    
        // Fetch multiple SuperAdmins
        const superAdminEntity = await this.superAdminRepo.findOne(superAdmin);
    
        if (!superAdminEntity) {
            throw new Error("Can't Find SuperAdmin");
        }
    
        // ✅ Create and save new organization with SuperAdmins
        let newOrganization = this.organizationRepo.create({ 
            name, 
            superAdmins:[superAdminEntity] 
        });
    
        newOrganization = await this.organizationRepo.save(newOrganization);
    
        return this.organizationRepo.findOne({
            where: { id: newOrganization.id },
            relations: ["superAdmins"],
        });
    }
    

    async findByIds(ids: number[]) {
        return this.organizationRepo.find({
            where: { id: In(ids) },
            relations: ["superAdmins",  "departments", "users"], // ✅ Fetch full objects
        });
    }
    
    async getAllOrganizations(): Promise<Organization[]> {
        return this.organizationRepo.find({
            relations: ["superAdmins",  "users", "departments","departments.users"],
        });
    }

    async assignDepartments(orgId: number, departmentIds: number[]): Promise<Organization> {
        const organization = await this.organizationRepo.findOne({
          where: { id: orgId },
          relations: ['departments'], 
        });
    
        if (!organization) {
          throw new Error('Organization not found');
        }
    
        const departments = await this.departmentRepo.find({
            where: { id: In(departmentIds) },
          });
          
    
        // Assign departments to organization
        organization.departments = [...organization.departments, ...departments];
        
        // Save organization with new departments
        return this.organizationRepo.save(organization);
      }

      async updateDepartments(orgId: number, departmentIds: number[]): Promise<Organization> {
        // Fetch the organization along with its departments and users
        const organization = await this.organizationRepo.findOne({
          where: { id: orgId },
          relations: ['departments', 'users'],
        });
      
        if (!organization) {
          throw new Error('Organization not found');
        }
      
        // Ensure departments is an array
        organization.departments = organization.departments ?? [];
      
        // Fetch the departments to be assigned
        const newDepartments = await this.departmentRepo.find({
          where: { id: In(departmentIds) },
        });
      
        // Find users that belong to the departments being removed
        const removedDepartments = organization.departments.filter(
          (dep) => dep?.id && !departmentIds.includes(dep.id)
        );
      
        const usersToRemove = organization.users.filter(
          (user) => user.department && removedDepartments.some((dep) => dep.id === user.department.id)
        );
      
        // Remove the users from the organization
        for (const user of usersToRemove) {
          user.organization = null; // Unassign the user from the organization
          await this.userRepo.save(user);
        }
      
        // Update the organization's departments
        organization.departments = newDepartments;
      
        return this.organizationRepo.save(organization);
      }

      async updateOrganizationName(orgId: number, name: string): Promise<Organization> {
        const organization = await this.organizationRepo.findOne({ where: { id: orgId } });
        if (!organization) {
          throw new Error('Organization not found');
        }
    
        organization.name = name;
        return this.organizationRepo.save(organization);
      }
      
      
    
}
