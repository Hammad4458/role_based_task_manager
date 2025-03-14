import { ITask } from 'src/domain/models/tasks.entity.interface';
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    ManyToMany, 
    CreateDateColumn, 
    UpdateDateColumn, 
    JoinTable 
  } from 'typeorm';
import { User } from './users.entity';

  
  export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
  }
  
  export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
  }
  
  @Entity()
  export class Task implements ITask {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 255 })
    title: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @Column({ type: 'date' })
    dueDate: Date;
  
    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.LOW })
    priority: TaskPriority;
  
    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
    status: TaskStatus;
  
    @ManyToMany(() => User, (user) => user.tasksAssigned)
    @JoinTable()
    assignedUsers: User[];
  
    @ManyToOne(() => User, (user) => user.tasksCreated, { nullable: false })
    createdBy: User;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  