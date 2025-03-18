import { 
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany 
} from 'typeorm';
import { SuperAdmin } from './superAdmin.entity';
import { Organization } from './organization.entity';
import { Department } from './departments.entity';
import { Task } from './tasks.entity';
import { IUser } from 'src/domain/models/users.entity.interface';

export enum UserRole {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ManyToOne(() => SuperAdmin, (superAdmin) => superAdmin.users, { nullable: true, cascade: ['insert', 'update'] })
  superAdmin: SuperAdmin;

  @ManyToOne(() => Organization, (organization) => organization.users, { cascade: ['insert', 'update'] })
  organization: Organization;

  @ManyToOne(() => Department, (department) => department.users, { cascade: ['insert', 'update'] })
  department: Department;

  // ✅ Manager-Subordinate Relationship
  @ManyToOne(() => User, (user) => user.subordinates, { nullable: true }) 
  manager: User; // If the user is a subordinate, this will point to their manager.

  @OneToMany(() => User, (user) => user.manager) 
  subordinates: User[]; // If the user is a manager, this will hold their assigned users.

  // ✅ Tasks Managed (Inverse of Task.manager)
  @OneToMany(() => Task, (task) => task.manager)
  tasksManaged: Task[]; // A manager manages multiple tasks.

  // ✅ Tasks Created
  @OneToMany(() => Task, (task) => task.createdBy)
  tasksCreated: Task[];

  // ✅ Tasks Assigned
  @ManyToMany(() => Task, (task) => task.assignedUsers)
  
  tasksAssigned: Task[];

  // ✅ Tasks Administered (Inverse of Task.admin)
  @OneToMany(() => Task, (task) => task.admin)
  adminTasks: Task[]; // If a user is an admin, they will have multiple tasks.
}

