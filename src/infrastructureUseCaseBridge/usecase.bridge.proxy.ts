export const SUPER_ADMIN_USECASE_PROXY = 'superAdminUseCaseProxy'

export class UseCaseProxy<T> {
    constructor(public readonly useCase: T) {}

}