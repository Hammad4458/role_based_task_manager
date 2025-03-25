import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  UnauthorizedException,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt-auth.guard';
import {
  SUPER_ADMIN_USECASE_PROXY,
  UseCaseProxy,
} from 'src/infrastructureUseCaseBridge/usecase.bridge.proxy';
import { SuperAdminUseCase } from 'src/usecase/superAdmin.usecase';

@Controller('super-admin')
export class SuperAdminController {
  constructor(
    @Inject(SUPER_ADMIN_USECASE_PROXY)
    private readonly superAdminUseCaseProxy: UseCaseProxy<SuperAdminUseCase>,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createSuperAdmin(
    @Body() body: { name: string; email: string; password: string },
  ) {
    console.log(body);
    return await this.superAdminUseCaseProxy.useCase.createUser(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.superAdminUseCaseProxy.useCase.validateUser(
      body.email,
      body.password,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllSuperAdmins() {
    return this.superAdminUseCaseProxy.useCase.getAllSuperAdmins();
  }

  
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserFromToken(@Headers('authorization') authHeader: string) {
    console.log('🚀 Route Hit: GET /me');

    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }

    console.log('🟢 Authorization Header:', authHeader);

    const token = authHeader.replace('Bearer ', '').trim();
    console.log('🟢 Extracted Token:', token);

    return await this.superAdminUseCaseProxy.useCase.getUserFromToken(token);
  }
}
