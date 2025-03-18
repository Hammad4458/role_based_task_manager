import { Controller, Post, Body, Get, Param, Inject } from '@nestjs/common';
import { Task, TaskPriority, TaskStatus } from 'src/infrastructure/orm/entities/tasks.entity';
import { TASK_USECASE_PROXY, UseCaseProxy } from 'src/infrastructureUseCaseBridge/usecase.bridge.proxy';
import { TaskUseCase } from 'src/usecase/tasks.usecase';

@Controller('tasks')
export class TaskController {
  constructor(
     @Inject(TASK_USECASE_PROXY)
        private readonly taskUseCaseProxy: UseCaseProxy<TaskUseCase>,
      ) {}

      @Post('create')
      async createTask(@Body() taskData: { 
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
        return this.taskUseCaseProxy.useCase.createTask(taskData);
      }
      
      

  @Get('department/:departmentId')
  async getTasksByDepartment(@Param('departmentId') departmentId: number): Promise<Task[]> {
    return this.taskUseCaseProxy.useCase.getTasksByDepartment(departmentId);
  }
}
