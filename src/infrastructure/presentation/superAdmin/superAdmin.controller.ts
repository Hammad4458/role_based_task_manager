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
import { CreateSuperAdminDto, LoginSuperAdminDto, TokenDto } from './superAdmin.dto';


@Controller('super-admin')
export class SuperAdminController {
  constructor(
    @Inject(SUPER_ADMIN_USECASE_PROXY)
    private readonly superAdminUseCaseProxy: UseCaseProxy<SuperAdminUseCase>,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createSuperAdmin(@Body() body: CreateSuperAdminDto) {
    return await this.superAdminUseCaseProxy.useCase.createUser(body);
  }

  @Post('login')
  async login(@Body() body: LoginSuperAdminDto) {
    return this.superAdminUseCaseProxy.useCase.validateUser(body.email, body.password);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllSuperAdmins() {
    return this.superAdminUseCaseProxy.useCase.getAllSuperAdmins();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserFromToken(@Headers() headers: TokenDto) {
    const authHeader = headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }
    const token = authHeader.replace('Bearer ', '').trim();
    return await this.superAdminUseCaseProxy.useCase.getUserFromToken(token);
  }

  @Post('refresh-token')
  async refreshAccessToken(@Body() body: { refresh_token: string }) {
    return await this.superAdminUseCaseProxy.useCase.refreshAccessToken(body.refresh_token);
  }
  
}
