import { Department } from "src/infrastructure/orm/entities/departments.entity";


export interface IDepartmentRepository {
  createDepartment(departmentData: {
    name: string;
    superAdmin: number;
    organizations?: number[];
  }): Promise<Department>;

  getAllDepartments(): Promise<Department[]>;
}
