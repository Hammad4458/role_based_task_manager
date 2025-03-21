import { Injectable } from "@nestjs/common";
import { Organization } from "src/infrastructure/orm/entities/organization.entity";
import { OrganizationRepository } from "src/infrastructure/orm/repositories/organizations.repositories";

@Injectable()
export class OrganizationUseCase{
    constructor(
        private readonly organizationRepo:OrganizationRepository,
    ){}

    async createOrganization(orgData: { name: string; superAdmin: number }) {
        return await this.organizationRepo.createOrganization(orgData);
    }

     async getAllOrganiations(): Promise<Organization[]> {
            return this.organizationRepo.getAllOrganizations();
        }
    
}