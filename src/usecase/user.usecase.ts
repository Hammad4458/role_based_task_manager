import { Injectable } from "@nestjs/common";
import { User, UserRole } from "src/infrastructure/orm/entities/users.entity";
import { UserRepository } from "src/infrastructure/orm/repositories/users.repositories";
import { BcryptService } from "src/infrastructure/services/bcrypt/bcrypt.module";

@Injectable()
export class UserUseCase{
    constructor(
        private readonly userRepo:UserRepository,
        private readonly bcryptService:BcryptService,
    ){}

    async createUser(body: {
        name: string;
        email: string;
        role?: UserRole;
        password: string;
        superAdmin: number;
        organization: number;
        department: number;
    }): Promise<User> {
        // ✅ Hash the password before saving
        const hashedPassword = await this.bcryptService.hashPassword(body.password);
    
        // ✅ Call repository with correct property names
        return await this.userRepo.createUser({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role ?? UserRole.USER, // Default to USER if not provided
            superAdminId: body.superAdmin, // ✅ Pass only the ID
            organizationId: body.organization, // ✅ Pass only the ID
            departmentId: body.department, // ✅ Pass only the ID
        });
    }

    async getAllUsers(): Promise<User[]> {
            return this.userRepo.getAllUsers();
        }

        async getUsersByDepartment(departmentId: number): Promise<User[]> {
            return this.userRepo.getUsersByDepartment(departmentId);
        }
        
    
}