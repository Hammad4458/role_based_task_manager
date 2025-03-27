import { SuperAdmin } from "src/infrastructure/orm/entities/superAdmin.entity";
export interface ISuperAdminRepository {
  createUser(data: { name: string; email: string; password: string }): Promise<SuperAdmin>;

  findOne(id: number): Promise<SuperAdmin | null>;

  findById(id: number): Promise<SuperAdmin | null>;

  getAllSuperAdmins(): Promise<SuperAdmin[]>;

  getUserByEmail(email: string): Promise<SuperAdmin | null>;
}
