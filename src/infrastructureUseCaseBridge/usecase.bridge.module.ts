import { DynamicModule, Module } from "@nestjs/common";
import { RepositoryModule } from "src/infrastructure/orm/repositories/repositories.module";
import { SUPER_ADMIN_USECASE_PROXY,ORGANIZATION_USECASE_PROXY, UseCaseProxy } from "./usecase.bridge.proxy";
import { SuperAdminUseCase } from "src/usecase/superAdmin.usecase";
import { SuperAdminRepository } from "src/infrastructure/orm/repositories/superAdmin.repositories";
import { OrganizationRepository } from "src/infrastructure/orm/repositories/organizations.repositories";
import { OrganizationUseCase } from "src/usecase/organizations.usecase";

@Module({
  imports: [RepositoryModule],
})
export class UseCaseProxyModule {
  static register(): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [
        {
          inject: [SuperAdminRepository], 
          provide: SUPER_ADMIN_USECASE_PROXY,
          useFactory: (superAdminRepo: SuperAdminRepository) =>
            new UseCaseProxy(new SuperAdminUseCase(superAdminRepo)),
        },
        {
          inject:[OrganizationRepository],
          provide:ORGANIZATION_USECASE_PROXY,
          useFactory:(organizationRepo:OrganizationRepository)=>
            new UseCaseProxy(new OrganizationUseCase(organizationRepo))
        },
      ],
      exports: [SUPER_ADMIN_USECASE_PROXY,ORGANIZATION_USECASE_PROXY],
    };
  }
}
