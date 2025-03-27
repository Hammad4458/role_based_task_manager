import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Department } from 'src/infrastructure/orm/entities/departments.entity';
import { Organization } from 'src/infrastructure/orm/entities/organization.entity';
import { User } from 'src/infrastructure/orm/entities/users.entity';

export class CreateSuperAdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginSuperAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SuperAdminResponseDto {
  id: number;
  name: string;
  email: string;
  organizations?: Organization[];
  departments?: Department[];
  users?: User[];
}

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  authorization: string;
}
