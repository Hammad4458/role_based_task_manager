import { IUser } from 'src/domain/models/users.entity.interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { SuperAdmin } from './superAdmin.entity';
import { Organization } from './organization.entity';
import { Department } from './departments.entity';
import { Task } from './tasks.entity';

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

  @ManyToOne(() => SuperAdmin, (superAdmin) => superAdmin.users, {
    nullable: true,
    cascade: ['insert', 'update'],
  })
  superAdmin?: SuperAdmin | null;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: true,
    cascade: ['insert', 'update'],
  })
  organization?: Organization | null;

  @ManyToOne(() => Department, (department) => department.users, {
    nullable: false, // Every user must belong to a department
    cascade: ['insert', 'update'],
  })
  department: Department;

  @ManyToOne(() => User, (user) => user.subordinates, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  manager?: User | null;

  @OneToMany(() => User, (user) => user.manager)
  subordinates?: User[];

  @OneToMany(() => Task, (task) => task.createdBy)
  tasksCreated: Task[];

  @ManyToMany(() => Task, (task) => task.assignedUsers)
  tasksAssigned: Task[];
}
