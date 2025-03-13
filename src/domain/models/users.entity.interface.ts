import { Department } from "src/infrastructure/orm/entities/departments.entity";
import { Organization } from "src/infrastructure/orm/entities/organization.entity";
import { SuperAdmin } from "src/infrastructure/orm/entities/superAdmin.entity";
import { Task } from "src/infrastructure/orm/entities/tasks.entity";

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'USER' | 'MANAGER' | 'ADMIN';
    superAdmin: SuperAdmin;
    organization: Organization;
    department: Department;
    tasksAssigned: Task[];
    tasksCreated: Task[];
  }
  