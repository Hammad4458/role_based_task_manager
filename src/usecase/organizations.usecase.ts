import { Injectable } from "@nestjs/common";
import { Organization } from "src/infrastructure/orm/entities/organization.entity";
import { OrganizationRepository } from "src/infrastructure/orm/repositories/organizations.repositories";

@Injectable()
export class OrganizationUseCase{
    constructor(
        private readonly organizationRepo:OrganizationRepository,
    ){}

    async createOrganization(org : Partial<Organization>):Promise<Organization>{
        
        return await this.organizationRepo.createOrganization(org);
    }
}