import { Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskPriority, TaskStatus } from '../entities/tasks.entity';
import { Department } from '../entities/departments.entity';
import { UserRepository } from './users.repositories';
import { User } from '../entities/users.entity';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,

    private readonly userRepository: UserRepository,
  ) {}

  async createTask(taskData: { 
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
    creator: number; 
    department: number; 
    assignedUsers: number[];
  }): Promise<Task> {
    // ✅ Validate that IDs exist
 
    if (!taskData.creator) throw new NotFoundException('Creator ID is required');
    if (!taskData.department) throw new NotFoundException('Department ID is required');
    if (!taskData.assignedUsers || taskData.assignedUsers.length === 0) {
      throw new NotFoundException('At least one assigned user ID is required');
    }
  
    const createdBy = await this.userRepository.getCreatorById(taskData.creator);
    const department = await this.departmentRepo.findOne({ where: { id: taskData.department } });
  
    if (!department) throw new NotFoundException('Department not found');
  
    const assignedUsers = await this.userRepository.validateAssignedUsers(taskData.assignedUsers);
  
    // ✅ Create Task Object with Proper Relations & Other Fields
    const task = this.taskRepo.create({
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      status: taskData.status,
      createdBy,
      department,
      assignedUsers,
    });
  
    // ✅ Save Task to Database
    return this.taskRepo.save(task);
  }
  

  async getTasksByDepartment(departmentId: number): Promise<Task[]> {
    if (!departmentId || isNaN(departmentId)) {
      throw new BadRequestException('Invalid department ID in repository');
    }
  
    return this.taskRepo.find({
      where: { department: { id: departmentId } },
      relations: ['assignedUsers', 'createdBy', 'department'],
    });
  }


  async getTasksByAssignedUser(userId: number): Promise<Task[]> {
    return this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUsers', 'assignedUser')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('task.id')
          .from(Task, 'task')
          .leftJoin('task.assignedUsers', 'subAssignedUser')
          .where('subAssignedUser.id = :userId')
          .getQuery();
        return 'task.id IN ' + subQuery;
      })
      .setParameter('userId', userId)
      .getMany();
  }
  
  

  async getAllTasks(): Promise<Task[]> {
          return this.taskRepo.find({
              relations: ["department"], 
          });
      }

      async updateTask(
        taskId: number,
        updateData: {
          title?: string;
          description?: string;
          dueDate?: Date;
          priority?: TaskPriority;
          status?: TaskStatus;
          assignedUsers?: number[];
        },
      ): Promise<Task> {
        const task = await this.taskRepo.findOne({
          where: { id: taskId },
          relations: ['assignedUsers'],
        });
    
        if (!task) throw new NotFoundException('Task not found');
    
        if (updateData.title) task.title = updateData.title;
        if (updateData.description) task.description = updateData.description;
        if (updateData.dueDate) task.dueDate = updateData.dueDate;
        if (updateData.priority) task.priority = updateData.priority;
        if (updateData.status) task.status = updateData.status;
    
        if (updateData.assignedUsers) {
          const assignedUsers = await this.userRepository.validateAssignedUsers(updateData.assignedUsers);
          task.assignedUsers = assignedUsers;
        }
    
        return this.taskRepo.save(task);
      }
  
}
