import { Controller, Post, Body, Inject } from "@nestjs/common";
import { SUPER_ADMIN_USECASE_PROXY, UseCaseProxy } from "src/infrastructureUseCaseBridge/usecase.bridge.proxy";
import { SuperAdminUseCase } from "src/usecase/superAdmin.usecase";

@Controller("super-admin")
export class SuperAdminController {
  constructor(
    @Inject(SUPER_ADMIN_USECASE_PROXY)
    private readonly superAdminUseCaseProxy: UseCaseProxy<SuperAdminUseCase>,
  ) {}

  @Post('create')
  async createSuperAdmin(@Body() body: any) {
    return this.superAdminUseCaseProxy.useCase.createSuperAdmin(body);
  }
}
