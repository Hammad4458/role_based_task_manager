export const SUPER_ADMIN_USECASE_PROXY = 'superAdminUseCaseProxy'
export const ORGANIZATION_USECASE_PROXY = 'organizationUseCaseProxy'
export const DEPARTMENT_USECASE_PROXY = 'departmentUseCaseProxy'
export const USER_USECASE_PROXY = 'userUseCaseProxy'
export const TASK_USECASE_PROXY = 'taskUseCaseProxy'

export class UseCaseProxy<T> {
    constructor(public readonly useCase: T) {}

}