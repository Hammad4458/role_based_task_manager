import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt-auth.guard';
import { Task } from 'src/infrastructure/orm/entities/tasks.entity';
import {
  TASK_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructureUseCaseBridge/usecase.bridge.proxy';
import { TaskUseCase } from 'src/usecase/tasks.usecase';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(
    @Inject(TASK_USECASE_PROXY)
    private readonly taskUseCaseProxy: UseCaseProxy<TaskUseCase>,
  ) {}

  @Post('create')
  async createTask(@Body() taskData: CreateTaskDto): Promise<Task> {
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
    @Body() updateData: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskUseCaseProxy.useCase.updateTask(taskId, updateData);
  }

  @Get()
  async getAllTasks() {
    return this.taskUseCaseProxy.useCase.getAllTasks();
  }
}
