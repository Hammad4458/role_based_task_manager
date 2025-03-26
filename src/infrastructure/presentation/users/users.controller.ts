import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Query,
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
  @UseGuards(JwtAuthGuard)
  async createUser(
    @Body()
    body: {
      name: string;
      email: string;
      role?: UserRole;
      password: string;
      superAdminId: number;  
      organizationId: number; 
      departmentId: number;   
      managerId?: number;     
    },
  ) {
    
    return await this.userUseCaseProxy.useCase.createUser(body);
  }
  

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(
    @Query("name") name?: string,
    @Query("role") role?: string,  // Role will be a string from query params
    @Query("department") department?: string,
    @Query("organization") organization?: string
  ) {
    return this.userUseCaseProxy.useCase.getAllUsers({
      name,
      role,  // Convert role string to UserRole enum
      department,
      organization
    });
  }
  

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserFromToken(@Headers('authorization') authHeader: string) {
   

    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }


    const token = authHeader.replace('Bearer ', '').trim();
   

    return await this.userUseCaseProxy.useCase.getUserFromToken(token);
  }

  @Get('managers/:departmentId')
  @UseGuards(JwtAuthGuard)
  async getManagersByDepartment(@Param('departmentId') departmentId: number) {
    return await this.userUseCaseProxy.useCase.getManagersByDepartment(departmentId);
  }

  @Get(':departmentId')
  @UseGuards(JwtAuthGuard)
  async getUsersByDepartment(@Param('departmentId') departmentId: number) {
    return await this.userUseCaseProxy.useCase.getUsersByDepartment(departmentId);
  }

  @Get('admins/:departmentId')
  @UseGuards(JwtAuthGuard)
  async getAdminsByDepartment(@Param('departmentId') departmentId: number) {
    return await this.userUseCaseProxy.useCase.getAdminsByDepartment(departmentId);
  }

  @Get('assignedUsers/managerId/:managerId')
  @UseGuards(JwtAuthGuard)
  async getAssignUsersByManager(@Param('managerId') managerId:number){
    return await  this.userUseCaseProxy.useCase.getAssignUsersByManager(managerId)
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
      password?: string;
      superAdminId?: number;
      organizationId?: number;
      departmentId?: number;
      managerId?: number;
    },
  ) {
   
    return await this.userUseCaseProxy.useCase.updateUser(userId, body);
  }
  

}
