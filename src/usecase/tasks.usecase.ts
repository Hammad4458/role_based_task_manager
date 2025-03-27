
import {  Injectable } from '@nestjs/common';
import { Task, TaskPriority, TaskStatus } from 'src/infrastructure/orm/entities/tasks.entity';
import { TaskRepository } from 'src/infrastructure/orm/repositories/tasks.repositories';

@Injectable()
export class TaskUseCase {
  constructor(private readonly taskRepo: TaskRepository) {}

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
    return this.taskRepo.createTask(taskData);
  }
  

  async getTasksByDepartment(departmentId: number): Promise<Task[]> {
    return this.taskRepo.getTasksByDepartment(departmentId);
  }


  async getTasksByAssignedUser(userId: number): Promise<Task[]> {
    return this.taskRepo.getTasksByAssignedUser(userId);
  }

  async getAllTasks(): Promise<Task[]> {
          return this.taskRepo.getAllTasks();
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
        return this.taskRepo.updateTask(taskId, updateData);
      }

      async changeTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
        return this.taskRepo.updateTaskStatus(taskId, status);
      }
  
}
