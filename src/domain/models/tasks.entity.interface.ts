import { User } from "src/infrastructure/orm/entities/users.entity";

export interface ITask {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    assignedUsers: User[];
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
  }
  