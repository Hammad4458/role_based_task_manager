import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { User } from 'src/infrastructure/orm/entities/users.entity';
import {
  DEPARTMENT_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructureUseCaseBridge/usecase.bridge.proxy';
import { DepartmentUseCase } from 'src/usecase/departments.usecase';

@Controller('department')
export class DepartmentController {
  constructor(
    @Inject(DEPARTMENT_USECASE_PROXY)
    private readonly departmentUseCaseProxy: UseCaseProxy<DepartmentUseCase>,
  ) {}

  @Post('create')
  async createDepartment(
    @Body()
    body: {
      name: string;
      superAdmin: number;
      organizations: number[];
    },
  ) {
    console.log(body);
    return this.departmentUseCaseProxy.useCase.createDepartment(body);
  }

  @Get()
  async getAllDepartments() {
    return this.departmentUseCaseProxy.useCase.getAllDepartments();
  }

  @Get('/:departmentId/users')
  async getUsersByDepartment(@Param('departmentId') departmentId: number): Promise<User[]> {
    return this.departmentUseCaseProxy.useCase.getUsersByDepartmentId(departmentId);
  }
}
