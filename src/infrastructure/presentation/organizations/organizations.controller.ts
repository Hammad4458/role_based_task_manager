import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { ORGANIZATION_USECASE_PROXY, UseCaseProxy } from "src/infrastructureUseCaseBridge/usecase.bridge.proxy";
import { OrganizationUseCase } from "src/usecase/organizations.usecase";

@Controller("organization")
export class OrganizationController{
    constructor(
        @Inject(ORGANIZATION_USECASE_PROXY)
        private readonly organizationUseCaseProxy:UseCaseProxy<OrganizationUseCase>,
    ){}
    @Post("create")
    async createOrganization(@Body() body: { name: string; superAdmin: number }) {
        console.log(body); 
        return this.organizationUseCaseProxy.useCase.createOrganization(body);
    }

     @Get()
      async getAllOrganizations() {
          return this.organizationUseCaseProxy.useCase.getAllOrganiations();
      }

    
}