import { Department } from "src/infrastructure/orm/entities/departments.entity";
import { Organization } from "src/infrastructure/orm/entities/organization.entity";
import { SuperAdmin } from "src/infrastructure/orm/entities/superAdmin.entity";
import { Task } from "src/infrastructure/orm/entities/tasks.entity";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'MANAGER' | 'ADMIN';
  superAdmin?: SuperAdmin | null; // Nullable if user is not under a SuperAdmin
  organization?: Organization | null; // Nullable if user is not in an organization
  department: Department;
  manager?: IUser | null; // Nullable because not all users have a manager
  subordinates?: IUser[]; // A user can have subordinates
  tasksAssigned: Task[];
  tasksCreated: Task[];
}
