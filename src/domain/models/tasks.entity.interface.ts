import { Department } from "src/infrastructure/orm/entities/departments.entity";
import { User } from "src/infrastructure/orm/entities/users.entity";

export interface ITask {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  department: Department;
  assignedUsers: User[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}