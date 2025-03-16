import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
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

  @ManyToOne(() => SuperAdmin, (superAdmin) => superAdmin.users, { nullable: true })
  superAdmin: SuperAdmin;

  @ManyToOne(() => Organization, (organization) => organization.users, { nullable: false })
  organization: Organization;

  @ManyToOne(() => Department, (department) => department.users)
  department: Department;

  @ManyToMany(() => Task, (task) => task.assignedUsers)
  @JoinTable()
  tasksAssigned: Task[];

  @OneToMany(() => Task, (task) => task.createdBy)
  tasksCreated: Task[];
}
