import { Organization } from "src/infrastructure/orm/entities/organization.entity";
import { SuperAdmin } from "src/infrastructure/orm/entities/superAdmin.entity";
import { User } from "src/infrastructure/orm/entities/users.entity";


export interface IDepartment {
  id: string;
  name: string;
  superAdmin: SuperAdmin[];
  organizations: Organization[];
  users:User[];
}
