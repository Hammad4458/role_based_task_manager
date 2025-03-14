import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Department } from "../entities/departments.entity";
import { SuperAdminRepository } from "./superAdmin.repositories";
import { OrganizationRepository } from "./organizations.repositories";

@Injectable()
export class DepartmentRepository {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepo: Repository<Department>,

        private readonly superAdminRepo: SuperAdminRepository,
        private readonly organizationRepo: OrganizationRepository
    ) {}

    async createDepartment(departmentData: { name: string; superAdminId: number; organizationIds: number[] }) {
        const { name, superAdminId, organizationIds } = departmentData;

        if (!name || !superAdminId || !Array.isArray(organizationIds) || organizationIds.length === 0) {
            throw new Error("Department name, a valid SuperAdmin ID, and at least one Organization ID are required.");
        }

        // Fetch SuperAdmin
        const superAdmin = await this.superAdminRepo.findOne({ where: { id: superAdminId } });
        if (!superAdmin) {
            throw new Error("Invalid SuperAdmin ID.");
        }

        // Fetch Organizations
        const organizations = await this.organizationRepo.find({
            where: { id: In(organizationIds) },
        });

        if (organizations.length !== organizationIds.length) {
            throw new Error("One or more Organization IDs are invalid.");
        }

        // Create and save new department
        let newDepartment = this.departmentRepo.create({ name, superAdmin });
        newDepartment = await this.departmentRepo.save(newDepartment);

        // Associate multiple Organizations with the Department
        await this.departmentRepo
            .createQueryBuilder()
            .relation(Department, "organizations")
            .of(newDepartment)
            .add(organizations);

        // Reload the department to include relations
        return this.departmentRepo.findOne({
            where: { id: newDepartment.id },
            relations: ["superAdmin", "organizations"],
        });
    }

    async getAllDepartments(): Promise<Department[]> {
        return this.departmentRepo.find({
            relations: ["superAdmin", "organizations", "users"],
        });
    }
}
