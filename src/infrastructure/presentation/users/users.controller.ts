import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from 'src/infrastructure/orm/entities/users.entity';
import {
  UseCaseProxy,
  USER_USECASE_PROXY,
} from 'src/infrastructureUseCaseBridge/usecase.bridge.proxy';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt-auth.guard';
import { UserUseCase } from 'src/usecase/user.usecase';

@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_USECASE_PROXY)
    private readonly userUseCaseProxy: UseCaseProxy<UserUseCase>,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.userUseCaseProxy.useCase.validateUser(
      body.email,
      body.password,
    );
  }

  @Post('create')
 // @UseGuards(JwtAuthGuard)
  async createUser(
    @Body()
    body: {
      name: string;
      email: string;
      role?: UserRole;
      password: string;
      superAdmin: number;
      organization: number;
      department: number;
      manager?:number;
    },
  ) {
    return await this.userUseCaseProxy.useCase.createUser(body);
  }

  @Get()
 // @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.userUseCaseProxy.useCase.getAllUsers();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserFromToken(@Headers('authorization') authHeader: string) {
    console.log('🚀 Route Hit: GET /me');

    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }

    console.log('Authorization Header:', authHeader);

    const token = authHeader.replace('Bearer ', '').trim();
    console.log('Extracted Token:', token);

    return await this.userUseCaseProxy.useCase.getUserFromToken(token);
  }

  @Get('managers/:departmentId')
  @UseGuards(JwtAuthGuard)
  async getManagersByDepartment(@Param('departmentId') departmentId: number) {
    return await this.userUseCaseProxy.useCase.getManagersByDepartment(departmentId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') userId: number,
    @Body()
    body: {
      name?: string;
      email?: string;
      role?: UserRole;
    },
  ) {
    return await this.userUseCaseProxy.useCase.updateUser(userId, body);
  }

}
