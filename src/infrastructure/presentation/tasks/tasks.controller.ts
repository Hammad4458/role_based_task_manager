import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import {
  Task,
  TaskPriority,
  TaskStatus,
} from 'src/infrastructure/orm/entities/tasks.entity';
import { User } from 'src/infrastructure/orm/entities/users.entity';
import {
  TASK_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructureUseCaseBridge/usecase.bridge.proxy';
import { TaskUseCase } from 'src/usecase/tasks.usecase';

@Controller('tasks')
export class TaskController {
  constructor(
    @Inject(TASK_USECASE_PROXY)
    private readonly taskUseCaseProxy: UseCaseProxy<TaskUseCase>,
  ) {}

  @Post('create')
  async createTask(
    @Body()
    taskData: {
      title: string;
      description: string;
      dueDate: Date;
      priority: TaskPriority;
      status: TaskStatus;
      creator: number;
      department: number;
      assignedUsers: number[];
    },
  ): Promise<Task> {
    console.log("DATAAA",taskData);
    return this.taskUseCaseProxy.useCase.createTask(taskData);
  }


  @Get('department/:departmentId')
  async getTasksByDepartment(
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ): Promise<Task[]> {
    return this.taskUseCaseProxy.useCase.getTasksByDepartment(departmentId);
  }

  @Get('/assigned/:userId')
  async getTasksByAssignedUser(@Param('userId') userId: number) {
    return this.taskUseCaseProxy.useCase.getTasksByAssignedUser(userId);
  }

  @Put('update/:taskId')
  async updateTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body()
    updateData: {
      title?: string;
      description?: string;
      dueDate?: Date;
      priority?: TaskPriority;
      status?: TaskStatus;
      assignedUsers?: number[];
    },
  ): Promise<Task> {
    return this.taskUseCaseProxy.useCase.updateTask(taskId, updateData);
  }

  @Get()
  async getAllTasks() {
      return this.taskUseCaseProxy.useCase.getAllTasks();
  }


}
