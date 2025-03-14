import { IDepartment } from 'src/domain/models/departments.entity.interface';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { SuperAdmin } from './superAdmin.entity';
import { Organization } from './organization.entity';
import { User } from './users.entity';


@Entity()
export class Department implements IDepartment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => SuperAdmin, (superAdmin) => superAdmin.departments)
  superAdmin: SuperAdmin[];

  @ManyToMany(() => Organization, (organization) => organization.departments)
  organizations: Organization[];

  @OneToMany(()=> User, (user)=>user.department)
  users:User[]
}
