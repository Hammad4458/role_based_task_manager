import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "../entities/users.entity";
import { In, Repository } from "typeorm";
import { SuperAdmin } from "../entities/superAdmin.entity";
import { Organization } from "../entities/organization.entity";
import { Department } from "../entities/departments.entity";

@Injectable()
export class UserRepository{
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(SuperAdmin)
        private readonly superAdminRepo:Repository<SuperAdmin>,
        @InjectRepository(Organization)
        private readonly organizationRepo:Repository<Organization>,
        @InjectRepository(Department)
        private readonly departmentRepo:Repository<Department>
    ){}

    async createUser(userData: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        superAdminId: number;
        organizationId: number;
        departmentId: number;
    }): Promise<User> {
        
        const superAdmin = await this.superAdminRepo.findOne({ where: { id: userData.superAdminId } });
        if (!superAdmin) throw new NotFoundException("SuperAdmin not found");
    
        
        const organization = await this.organizationRepo.findOne({ where: { id: userData.organizationId } });
        if (!organization) throw new NotFoundException("Organization not found");
    
        
        const department = await this.departmentRepo.findOne({ where: { id: userData.departmentId } });
        if (!department) throw new NotFoundException("Department not found");
    
        
        const newUser = this.userRepo.create({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            superAdmin, 
            organization, 
            department, 
        });
    
        // ✅ Save user in the database
        return await this.userRepo.save(newUser);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepo.find({
            relations: ["superAdmin", "organization", "department", "tasksAssigned",
            "tasksManaged",
            "tasksCreated",
            "adminTasks"],
        });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepo.findOne({ 
            where: { email }, 
            relations: ["superAdmin", "organization", "department" , "tasksAssigned",
            "tasksManaged",
            "tasksCreated",
            "adminTasks"
        ] 
        });
    }
   
  
    async getCreatorById(creatorId: number): Promise<User> {
        const creator = await this.userRepo.findOne({ where: { id: creatorId, role: UserRole.MANAGER || UserRole.ADMIN } });
        if (!creator) throw new NotFoundException('Creator not found or invalid Role');
        return creator;
    }

    // ✅ Validate Assigned Users Exist
    async validateAssignedUsers(userIds: number[]): Promise<User[]> {
        const users = await this.userRepo.find({
            where: { id: In(userIds) },
        });
    
        if (users.length !== userIds.length) {
            throw new NotFoundException("One or more assigned users not found");
        }
    
        return users;
    }

    
}