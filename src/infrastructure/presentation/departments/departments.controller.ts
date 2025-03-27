import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt-auth.guard';
import {
  DEPARTMENT_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructureUseCaseBridge/usecase.bridge.proxy';
import { DepartmentUseCase } from 'src/usecase/departments.usecase';
import { CreateDepartmentDto } from './departments.dto';

@UseGuards(JwtAuthGuard)
@Controller('department')
export class DepartmentController {
  constructor(
    @Inject(DEPARTMENT_USECASE_PROXY)
    private readonly departmentUseCaseProxy: UseCaseProxy<DepartmentUseCase>,
  ) {}

  @Post('create')
  async createDepartment(@Body() body: CreateDepartmentDto) {
    return this.departmentUseCaseProxy.useCase.createDepartment(body);
  }

  @Get()
  async getAllDepartments() {
    return this.departmentUseCaseProxy.useCase.getAllDepartments();
  }
}
