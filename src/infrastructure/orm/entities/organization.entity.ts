import { IOrganization } from 'src/domain/models/organizations.entity.interface';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { SuperAdmin } from './superAdmin.entity';
import { Department } from './departments.entity';
import { User } from './users.entity';


@Entity()
export class Organization implements IOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => SuperAdmin, (superAdmin) => superAdmin.organizations) 
  @JoinTable()
  superAdmins: SuperAdmin[];

  @ManyToMany(() => Department, (department) => department.organizations)
  @JoinTable()
  departments: Department[];

  @OneToMany(() => User, (user) => user.organization)
  users: User[];
}
