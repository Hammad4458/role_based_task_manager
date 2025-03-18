import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskPriority, TaskStatus } from '../entities/tasks.entity';
import { Department } from '../entities/departments.entity';
import { UserRepository } from './users.repositories';

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
    admin: number; 
    manager:number,
    creator: number; 
    department: number; 
    assignedUsers: number[];
  }): Promise<Task> {
    // ✅ Validate that IDs exist
    if (!taskData.admin) throw new NotFoundException('Admin ID is required');
    if (!taskData.manager) throw new NotFoundException('Manager ID is required');
    if (!taskData.creator) throw new NotFoundException('Creator ID is required');
    if (!taskData.department) throw new NotFoundException('Department ID is required');
    if (!taskData.assignedUsers || taskData.assignedUsers.length === 0) {
      throw new NotFoundException('At least one assigned user ID is required');
    }
  
    // ✅ Fetch full entities using IDs
    const admin = await this.userRepository.getSuperAdminById(taskData.admin);
    const manager = await this.userRepository.getManagerById(taskData.manager);
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
      admin,
      manager,
      createdBy,
      department,
      assignedUsers,
    });
  
    // ✅ Save Task to Database
    return this.taskRepo.save(task);
  }
  

  async getTasksByDepartment(departmentId: number): Promise<Task[]> {
    // ✅ Verify if Department exists
    const departmentExists = await this.departmentRepo.findOne({ where: { id: departmentId } });
    if (!departmentExists) throw new NotFoundException('Department not found');

    return this.taskRepo.find({
      where: { department: { id: departmentId } },
      relations: ['assignedUsers', 'createdBy', 'admin', 'department'],
    });
  }
}
