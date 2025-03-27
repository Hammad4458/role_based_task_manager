import { Organization } from "src/infrastructure/orm/entities/organization.entity";

export interface IOrganizationRepository {
    createOrganization(organizationData: { name: string; superAdmin: number }): Promise<Organization | null>;
  
    findByIds(ids: number[]): Promise<Organization[]>;
  
    getAllOrganizations(): Promise<Organization[]>;
  
    assignDepartments(orgId: number, departmentIds: number[]): Promise<Organization>;
  
    updateDepartments(orgId: number, departmentIds: number[]): Promise<Organization>;
  }
  