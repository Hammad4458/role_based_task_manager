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
        managerId?: number;
      }): Promise<User> {
        const [superAdmin, organization, department] = await Promise.all([
          this.superAdminRepo.findOne({ where: { id: userData.superAdminId } }),
          this.organizationRepo.findOne({ where: { id: userData.organizationId } }),
          this.departmentRepo.findOne({ where: { id: userData.departmentId } }),
        ]);
      
        if (!superAdmin) throw new NotFoundException("SuperAdmin not found");
        if (!organization) throw new NotFoundException("Organization not found");
        if (!department) throw new NotFoundException("Department not found");
      
        let manager: User | undefined = undefined;

      
        // ✅ Ensure manager exists before assigning
        if (userData.managerId) {
            manager = (await this.userRepo.findOne({
                where: { id: userData.managerId },
                relations: ['manager'], // ✅ Load related manager
              })) || undefined;
      
          if (!manager) {
            throw new NotFoundException(`Manager with ID ${userData.managerId} not found`);
          }
        }
      
        // ✅ Use `create()` but explicitly assign manager 
        const newUser = this.userRepo.create({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          superAdmin,
          organization,
          department,
          manager, // ✅ Now correctly assigned
        });
      
        return await this.userRepo.save(newUser); // ✅ Ensure manager is included in save()
      }
      
      
    

      async getAllUsers(): Promise<User[]> {
        return this.userRepo.createQueryBuilder("user")
            .leftJoinAndSelect("user.superAdmin", "superAdmin")
            .leftJoinAndSelect("user.organization", "organization")
            .leftJoinAndSelect("user.department", "department")
            .leftJoinAndSelect("user.manager", "manager")
            .leftJoinAndSelect("manager.organization", "managerOrganization") // Load manager's organization
            .leftJoinAndSelect("manager.department", "managerDepartment") // Load manager's department
            .getMany();
    }
    

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepo.findOne({ 
            where: { email }, 
            relations: ["superAdmin", "organization", "department" ,"subordinates" ] 
        });
    }
   
  
    async getCreatorById(creatorId: number): Promise<User> {
      const creator = await this.userRepo.findOne({
          where: { id: creatorId, role: In([UserRole.MANAGER, UserRole.ADMIN]) } // ✅ Fixed syntax
      });
  
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

    async findManagersByDepartment(departmentId: number): Promise<User[]> {
        return await this.userRepo.find({
          where: { 
            department: { id: departmentId }, // Pass as an object reference
            role: UserRole.MANAGER
          },
          relations: ["subordinates" ] 
        });
      }
      
      async getUserById(userId: number): Promise<User | null> {
        return await this.userRepo.findOne({
          where: { id: userId },
          relations: ["superAdmin", "organization", "department", "subordinates"],
        });
      }
      
      async updateUser(user: User): Promise<User> {
        return await this.userRepo.save(user); // Save the updated user entity
      }
      
      
}