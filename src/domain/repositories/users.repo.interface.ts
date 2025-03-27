import { User, UserRole } from "src/infrastructure/orm/entities/users.entity";


export interface IUserRepository {
  createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    superAdminId: number;
    organizationId: number;
    departmentId: number;
    managerId?: number;
  }): Promise<User>;

  getAllUsers(filters: {
    name?: string;
    role?: string;
    department?: string;
    organization?: string;
  }): Promise<User[]>;

  getUserByEmail(email: string): Promise<User | null>;

  getCreatorById(creatorId: number): Promise<User>;

  validateAssignedUsers(userIds: number[]): Promise<User[]>;

  getUsersByDepartment(departmentId: number): Promise<User[]>;

  getAdminsByDepartment(departmentId: number): Promise<User[]>;

  findManagersByDepartment(departmentId: number): Promise<User[]>;

  getAssignUsersByManager(managerId: number): Promise<User[]>;

  getUserById(userId: number): Promise<User | null>;

  updateUser(userId: number, userData: Partial<User> & { 
    superAdminId?: number; 
    organizationId?: number; 
    departmentId?: number; 
    managerId?: number; 
  }): Promise<User>;
}
