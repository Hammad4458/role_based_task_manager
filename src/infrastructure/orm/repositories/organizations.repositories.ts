import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Organization } from "../entities/organization.entity"; 
import { SuperAdminRepository } from "./superAdmin.repositories";

@Injectable()
export class OrganizationRepository {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepo: Repository<Organization>,

        private readonly superAdminRepo: SuperAdminRepository, 
    ) {}

    async createOrganization(organizationData: { name: string; superAdmin: number[] }) {
        const { name, superAdmin } = organizationData;
    
        if (!name || !Array.isArray(superAdmin) || superAdmin.length === 0) {
            throw new Error("Organization name and at least one SuperAdmin ID are required.");
        }
    
        // Fetch multiple SuperAdmins
        const superAdmins = await this.superAdminRepo.findByIds(superAdmin);
    
        if (superAdmins.length !== superAdmin.length) {
            throw new Error("One or more SuperAdmin IDs are invalid.");
        }
    
        // ✅ Create and save new organization with SuperAdmins
        let newOrganization = this.organizationRepo.create({ 
            name, 
            superAdmins // ✅ Include superAdmins here
        });
    
        newOrganization = await this.organizationRepo.save(newOrganization);
    
        // ✅ No need to separately associate superAdmins after saving
    
        // Reload the organization to include relations
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
            relations: ["superAdmins",  "users", "departments"],
        });
    }
    
}
