import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../entities/users.entity';
import { In, Repository } from 'typeorm';
import { SuperAdmin } from '../entities/superAdmin.entity';
import { Organization } from '../entities/organization.entity';
import { Department } from '../entities/departments.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(SuperAdmin)
    private readonly superAdminRepo: Repository<SuperAdmin>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

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

    if (!superAdmin) throw new NotFoundException('SuperAdmin not found');
    if (!organization) throw new NotFoundException('Organization not found');
    if (!department) throw new NotFoundException('Department not found');

    let manager: User | null = null;
    if (userData.managerId) {

      manager = await this.userRepo.findOne({
        where: { id: userData.managerId },
        select: ['id', 'name', 'email'], 
      });

      if (!manager) {
        throw new NotFoundException(
          `Manager with ID ${userData.managerId} not found`,
        );
      }
    }

    const newUser = this.userRepo.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      superAdmin,
      organization,
      department,
    });

    if (manager) {
      newUser.manager = manager; 
    }

    return this.userRepo.save(newUser);
  }

  async getAllUsers(filters: {
    name?: string;
    role?: string;
    department?: string;
    organization?: string;
  }): Promise<User[]> {
    const { name, role, department, organization } = filters;

    const query = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.department', 'department');

    if (name) query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    if (role) query.andWhere('user.role = :role', { role });
    if (department)
      query.andWhere('department.name = :department', { department });
    if (organization)
      query.andWhere('organization.name = :organization', { organization });

    return query.getMany();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { email },
      relations: ['superAdmin', 'organization', 'department', 'subordinates'],
    });
  }

  async getCreatorById(creatorId: number): Promise<User> {
    const creator = await this.userRepo.findOne({
      where: { id: creatorId, role: In([UserRole.MANAGER, UserRole.ADMIN]) }, 
    });

    if (!creator)
      throw new NotFoundException('Creator not found or invalid Role');
    return creator;
  }
 
  async validateAssignedUsers(userIds: number[]): Promise<User[]> {
    const users = await this.userRepo.find({
      where: { id: In(userIds) },
    });

    if (users.length !== userIds.length) {
      throw new NotFoundException('One or more assigned users not found');
    }

    return users;
  }

  async getUsersByDepartment(departmentId: number): Promise<User[]> {
    const users = await this.userRepo.find({
      where: {
        department: { id: departmentId },
      },
      relations: ['department', 'organization','manager'], 
    });

    if (!users.length) {
      throw new Error('No users found for this department');
    }

    return users.filter((user) => user.role === UserRole.USER);
  }

  async getAdminsByDepartment(departmentId: number): Promise<User[]> {
    const users = await this.userRepo.find({
      where: {
        department: { id: departmentId },
      },
      relations: ['department', 'organization','manager'], 
    });

    if (!users.length) {
      throw new Error('No users found for this department');
    }

    return users.filter((user) => user.role === UserRole.ADMIN);
  }

  async findManagersByDepartment(departmentId: number): Promise<User[]> {
    return await this.userRepo.find({
      where: {
        department: { id: departmentId }, 
        role: UserRole.MANAGER,
      },
      relations: ['subordinates'],
    });
  }
  async getAssignUsersByManager(managerId: number): Promise<User[]> {
    return await this.userRepo.find({
      where: {
        manager: { id: managerId },
      },
      relations: ['subordinates', 'organization', 'department'],
    });
  }

  async getUserById(userId: number): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id: userId },
      relations: ['superAdmin', 'organization', 'department', 'subordinates'],
    });
  }

  async updateUser(userId: number, userData: Partial<User> & { 
    superAdminId?: number; 
    organizationId?: number; 
    departmentId?: number; 
    managerId?: number; 
  }): Promise<User> {
    
  
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['superAdmin', 'organization', 'department', 'manager'],
    });
  
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
  
    
    const superAdmin = userData.superAdminId 
      ? await this.superAdminRepo.findOne({ where: { id: userData.superAdminId } }) ?? undefined 
      : user.superAdmin;
    
    const organization = userData.organizationId 
      ? await this.organizationRepo.findOne({ where: { id: userData.organizationId } }) ?? undefined 
      : user.organization;
    
    const department = userData.departmentId 
      ? await this.departmentRepo.findOne({ where: { id: userData.departmentId } }) ?? undefined 
      : user.department;
  
    const manager = userData.managerId 
      ? await this.userRepo.findOne({ where: { id: userData.managerId }, select: ['id', 'name', 'email'] }) ?? undefined 
      : user.manager;
  
    // Assign updated fields
    Object.assign(user, {
      ...userData,
      password: userData.password || user.password, 
      superAdmin,
      organization,
      department,
      manager,
    });
  
  
    return this.userRepo.save(user);
  }
  
  
}
