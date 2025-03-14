export const SUPER_ADMIN_USECASE_PROXY = 'superAdminUseCaseProxy'
export const ORGANIZATION_USECASE_PROXY = 'organizationUseCaseProxy'

export class UseCaseProxy<T> {
    constructor(public readonly useCase: T) {}

}