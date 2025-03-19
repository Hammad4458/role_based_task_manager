import { ISuperAdmin } from 'src/domain/models/superAdmin.entity.interface';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Organization } from './organization.entity';
import { Department } from './departments.entity';
import { User } from './users.entity';


@Entity()
export class SuperAdmin implements ISuperAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 255 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToMany(() => Organization, (organization) => organization.superAdmins)
  @JoinTable()
  organizations: Organization[];

  @OneToMany(() => Department, (department) => department.superAdmin, {nullable : true})
  departments: Department[];

  @OneToMany(() => User, (user) => user.superAdmin,{nullable : true})
  users: User[];
}
