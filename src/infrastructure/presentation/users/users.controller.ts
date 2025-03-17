import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { UserRole } from "src/infrastructure/orm/entities/users.entity";
import { UseCaseProxy, USER_USECASE_PROXY } from "src/infrastructureUseCaseBridge/usecase.bridge.proxy";
import { UserUseCase } from "src/usecase/user.usecase";


@Controller('users')
export class UserController{
    constructor(
        @Inject(USER_USECASE_PROXY)
        private readonly userUseCaseProxy : UseCaseProxy<UserUseCase>
    ){}

    @Post('create')
    async createUser(
        @Body() body: { 
            name: string; 
            email: string; 
            role?: UserRole; 
            password: string; 
            superAdmin: number; 
            organization: number; 
            department: number; 
        }
    ) {
        return await this.userUseCaseProxy.useCase.createUser(body);
    }

    @Get()
    async getAllUsers(){
        return this.userUseCaseProxy.useCase.getAllUsers();
    }

    @Get(':departmentId')
    async getUsersByDepartment(@Param('departmentId') departmentId: number) {
    return this.userUseCaseProxy.useCase.getUsersByDepartment(Number(departmentId));
}
    
}