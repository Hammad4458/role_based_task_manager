import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt-auth.guard';
import {
  ORGANIZATION_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructureUseCaseBridge/usecase.bridge.proxy';
import { OrganizationUseCase } from 'src/usecase/organizations.usecase';
import { AssignDepartmentsDto, CreateOrganizationDto, UpdateDepartmentsDto } from './organizations.dto';

@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(
    @Inject(ORGANIZATION_USECASE_PROXY)
    private readonly organizationUseCaseProxy: UseCaseProxy<OrganizationUseCase>,
  ) {}

  @Post('create')
  async createOrganization(@Body() body: CreateOrganizationDto) {
    return this.organizationUseCaseProxy.useCase.createOrganization(body);
  }

  @Get()
  async getAllOrganizations() {
    return this.organizationUseCaseProxy.useCase.getAllOrganiations();
  }

  @Post(':id/assign-departments')
  async assignDepartments(
    @Param('id') orgId: number,
    @Body() body: AssignDepartmentsDto,
  ) {
    return this.organizationUseCaseProxy.useCase.assignDepartments(
      orgId,
      body.departmentIds,
    );
  }

  @Put(':id/update-departments')
  async updateDepartments(
    @Param('id') orgId: number,
    @Body() body: UpdateDepartmentsDto,
  ) {
    return this.organizationUseCaseProxy.useCase.updateDepartments(
      orgId,
      body.departmentIds,
    );
  }
}
