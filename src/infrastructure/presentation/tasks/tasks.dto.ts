import { IsEnum, IsInt, IsOptional, IsString, IsDate, IsArray } from 'class-validator';
import { TaskPriority, TaskStatus } from 'src/infrastructure/orm/entities/tasks.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  dueDate: Date;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsInt()
  creator: number;

  @IsInt()
  department: number;

  @IsArray()
  @IsInt({ each: true })
  assignedUsers: number[];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  assignedUsers?: number[];
}
