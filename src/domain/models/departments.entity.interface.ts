import { Organization } from "src/infrastructure/orm/entities/organization.entity";
import { SuperAdmin } from "src/infrastructure/orm/entities/superAdmin.entity";
import { Task } from "src/infrastructure/orm/entities/tasks.entity";
import { User } from "src/infrastructure/orm/entities/users.entity";

export interface IDepartment {
  id: number;
  name: string;
  superAdmin: SuperAdmin;
  organizations: Organization[];  // ✅ Many-to-Many relationship
  users: User[];
  tasks: Task[];
}
