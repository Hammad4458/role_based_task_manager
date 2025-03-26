import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from 'src/infrastructure/orm/entities/users.entity';
import { UserRepository } from 'src/infrastructure/orm/repositories/users.repositories';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { JwtService } from 'src/infrastructure/services/jwt/jwt.service';

@Injectable()
export class UserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(body: {
    name: string;
    email: string;
    role?: UserRole;
    password: string;
    superAdminId: number;  
    organizationId: number; 
    departmentId: number;   
    managerId?: number;     
  }): Promise<User> {
    const hashedPassword = await this.bcryptService.hashPassword(body.password);
  
    return await this.userRepo.createUser({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role ?? UserRole.USER,
      superAdminId: body.superAdminId,  // 🔥 Use correct names
      organizationId: body.organizationId,
      departmentId: body.departmentId,
      managerId: body.managerId || undefined,
    });
  }
  
  async getAllUsers(filters: { name?: string; role?: string; department?: string; organization?: string }): Promise<User[]> {
    return this.userRepo.getAllUsers(filters);
  }

  async getUserFromToken(token: string) {
    try {
      
      const decoded = this.jwtService.verify(token);

      if (!decoded || !decoded.email || !decoded.id) {
        throw new UnauthorizedException('Invalid token');
      }

      // 🔍 Fetch user from DB
      const user = await this.userRepo.getUserByEmail(decoded.email);

      if (!user || user.id !== decoded.id) {
        throw new UnauthorizedException('User not found');
      }

      // ✅ Remove password before returning user
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await this.bcryptService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ✅ Remove password before returning user
    const { password: _, ...userWithoutPassword } = user;

    // 🔑 Generate JWT token
    const payload = { email: user.email, id: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async getManagersByDepartment(departmentId: number) {
    return await this.userRepo.findManagersByDepartment(departmentId);
  }

  async getUsersByDepartment(departmentId:number){
    return await this.userRepo.getUsersByDepartment(departmentId);
  }

  async getAdminsByDepartment(departmentId:number){
    return await this.userRepo.getAdminsByDepartment(departmentId)
  }

  async getAssignUsersByManager(managerId: number){
    return await this.userRepo.getAssignUsersByManager(managerId);
  }

  async updateUser(
    userId: number,
    body: {
      name?: string;
      email?: string;
      role?: UserRole;
      password?: string;
      superAdminId?: number;
      organizationId?: number;
      departmentId?: number;
      managerId?: number;
    },
  ): Promise<User> {
   
  
    // Hash password if provided
    let hashedPassword: string | undefined = undefined;
    if (body.password) {
      hashedPassword = await this.bcryptService.hashPassword(body.password);
    }
  
    return await this.userRepo.updateUser(userId, {
      ...body,
      password: hashedPassword, 
    });
  }
  
  

}
