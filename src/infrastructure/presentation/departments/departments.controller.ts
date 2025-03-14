import { Body, Controller, Inject, Post } from "@nestjs/common";
import { DEPARTMENT_USECASE_PROXY, UseCaseProxy } from "src/infrastructureUseCaseBridge/usecase.bridge.proxy";
import { DepartmentUseCase } from "src/usecase/departments.usecase";

@Controller("department")
export class DepartmentController{
    constructor(
        @Inject(DEPARTMENT_USECASE_PROXY)
        private readonly departmentUseCaseProxy:UseCaseProxy<DepartmentUseCase>
    ){}

    @Post('create')
    async createDepartment(@Body() body:any){
        console.log(body);
        return this.departmentUseCaseProxy.useCase.createDepartment(body);
    }

}