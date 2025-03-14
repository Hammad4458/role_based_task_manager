import { DynamicModule, Module } from "@nestjs/common";
import { RepositoryModule } from "src/infrastructure/orm/repositories/repositories.module";
import { SuperAdminRepository } from "src/infrastructure/orm/repositories/users.repositories";
import { SUPER_ADMIN_USECASE_PROXY, UseCaseProxy } from "./usecase.bridge.proxy";
import { SuperAdminUseCase } from "src/usecase/superAdmin.usecase";

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
      ],
      exports: [SUPER_ADMIN_USECASE_PROXY],
    };
  }
}
