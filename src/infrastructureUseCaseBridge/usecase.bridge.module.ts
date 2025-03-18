import { DynamicModule, Module } from "@nestjs/common";
import { RepositoryModule } from "src/infrastructure/orm/repositories/repositories.module";
import { SUPER_ADMIN_USECASE_PROXY,ORGANIZATION_USECASE_PROXY, UseCaseProxy, DEPARTMENT_USECASE_PROXY, USER_USECASE_PROXY, TASK_USECASE_PROXY } from "./usecase.bridge.proxy";
import { SuperAdminUseCase } from "src/usecase/superAdmin.usecase";
import { SuperAdminRepository } from "src/infrastructure/orm/repositories/superAdmin.repositories";
import { OrganizationRepository } from "src/infrastructure/orm/repositories/organizations.repositories";
import { OrganizationUseCase } from "src/usecase/organizations.usecase";
import { DepartmentRepository } from "src/infrastructure/orm/repositories/departments.repositories";
import { DepartmentUseCase } from "src/usecase/departments.usecase";
import { UserRepository } from "src/infrastructure/orm/repositories/users.repositories";
import { UserUseCase } from "src/usecase/user.usecase";
import { BcryptService } from "src/infrastructure/services/bcrypt/bcrypt.module";
import { BcryptModule } from "src/infrastructure/services/bcrypt/bcrypt.service";
import { JwtService } from "src/infrastructure/services/jwt/jwt.service";
import { JwtModule } from "src/infrastructure/services/jwt/jwt.module";
import { TaskRepository } from "src/infrastructure/orm/repositories/tasks.repositories";
import { TaskUseCase } from "src/usecase/tasks.usecase";


@Module({
  imports: [RepositoryModule,BcryptModule,JwtModule],
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
        {
          inject:[DepartmentRepository],
          provide:DEPARTMENT_USECASE_PROXY,
          useFactory:(departmentRepo:DepartmentRepository)=>
            new UseCaseProxy(new DepartmentUseCase(departmentRepo))
        },
        {
          provide: USER_USECASE_PROXY,
          inject: [UserRepository, BcryptService,JwtService],
          useFactory: (userRepo: UserRepository, bcryptService: BcryptService,jwtService:JwtService) =>
            new UseCaseProxy(new UserUseCase(userRepo, bcryptService,jwtService)),
        },
        {
          provide: TASK_USECASE_PROXY,
          inject: [TaskRepository],
          useFactory: (taskRepository:TaskRepository) =>
            new UseCaseProxy(new TaskUseCase(taskRepository)),
        }
      ],
      exports: [SUPER_ADMIN_USECASE_PROXY,
        ORGANIZATION_USECASE_PROXY,
        DEPARTMENT_USECASE_PROXY,
        USER_USECASE_PROXY,
        TASK_USECASE_PROXY
      ],
    };
  }
}
