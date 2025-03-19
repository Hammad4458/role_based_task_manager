import { Controller, Post, Body, Inject, Get } from "@nestjs/common";
import { SUPER_ADMIN_USECASE_PROXY, UseCaseProxy } from "src/infrastructureUseCaseBridge/usecase.bridge.proxy";
import { SuperAdminUseCase } from "src/usecase/superAdmin.usecase";

@Controller("super-admin")
export class SuperAdminController {
  constructor(
    @Inject(SUPER_ADMIN_USECASE_PROXY)
    private readonly superAdminUseCaseProxy: UseCaseProxy<SuperAdminUseCase>,
  ) {}

  @Post('create')
  async createSuperAdmin(
    @Body() body: { name: string; email: string; password: string },
  ) {
    console.log(body);
    return await this.superAdminUseCaseProxy.useCase.createUser(body);
  }


  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.superAdminUseCaseProxy.useCase.validateUser(
      body.email,
      body.password,
    );
  }


  @Get()
  async getAllSuperAdmins() {
      return this.superAdminUseCaseProxy.useCase.getAllSuperAdmins();
  }
}
