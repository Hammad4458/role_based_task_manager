import { Department } from "src/infrastructure/orm/entities/departments.entity";
import { Organization } from "src/infrastructure/orm/entities/organization.entity";
import { User } from "src/infrastructure/orm/entities/users.entity";

export interface ISuperAdmin {
  id: number;
  name: string;
  organizations?: Organization[];
  departments?: Department[];
  users?: User[];
}
