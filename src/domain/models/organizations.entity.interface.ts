import { Department } from "src/infrastructure/orm/entities/departments.entity";
import { SuperAdmin } from "src/infrastructure/orm/entities/superAdmin.entity";
import { User } from "src/infrastructure/orm/entities/users.entity";

export interface IOrganization {
  id: number;
  name: string;
  superAdmins: SuperAdmin[];
  departments: Department[]; 
  users: User[];
}
