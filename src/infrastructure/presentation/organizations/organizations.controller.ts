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

@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(
    @Inject(ORGANIZATION_USECASE_PROXY)
    private readonly organizationUseCaseProxy: UseCaseProxy<OrganizationUseCase>,
  ) {}
  @Post('create')
  async createOrganization(@Body() body: { name: string; superAdmin: number }) {
    return this.organizationUseCaseProxy.useCase.createOrganization(body);
  }

  @Get()
  async getAllOrganizations() {
    return this.organizationUseCaseProxy.useCase.getAllOrganiations();
  }

  @Post(':id/assign-departments')
  async assignDepartments(
    @Param('id') orgId: number,
    @Body('departmentIds') departmentIds: number[],
  ) {
    return this.organizationUseCaseProxy.useCase.assignDepartments(
      orgId,
      departmentIds,
    );
  }

  // Update departments for an organization
  @Put(':id/update-departments')
  async updateDepartments(
    @Param('id') orgId: number,
    @Body('departmentIds') departmentIds: number[],
  ) {
    return this.organizationUseCaseProxy.useCase.updateDepartments(
      orgId,
      departmentIds,
    );
  }

}
