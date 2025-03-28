import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  superAdmin: number;
}

export class UpdateDepartmentNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
