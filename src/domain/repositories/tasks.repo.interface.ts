import {
  Task,
  TaskPriority,
  TaskStatus,
} from 'src/infrastructure/orm/entities/tasks.entity';

export interface ITaskRepository {
  createTask(taskData: {
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
    creator: number;
    department: number;
    assignedUsers: number[];
  }): Promise<Task>;

  getTasksByDepartment(departmentId: number): Promise<Task[]>;

  getTasksByAssignedUser(userId: number): Promise<Task[]>;

  getAllTasks(): Promise<Task[]>;

  updateTask(
    taskId: number,
    updateData: {
      title?: string;
      description?: string;
      dueDate?: Date;
      priority?: TaskPriority;
      status?: TaskStatus;
      assignedUsers?: number[];
    },
  ): Promise<Task>;
}
