import { Injectable } from "@nestjs/common";
import { Organization } from "../entities/organization.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IOrganization } from "src/domain/models/organizations.entity.interface";

@Injectable()
export class OrganizationRepository{
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepo: Repository<Organization>,
     ) {}
     
    async createOrganization(organization : Partial<IOrganization>){
        if(!organization || Object.keys(organization).length===0){
            throw new Error("Organization data is missing");
        }
        const newOrganization = this.organizationRepo.create(organization);
        return await this.organizationRepo.save(newOrganization);
    }

}