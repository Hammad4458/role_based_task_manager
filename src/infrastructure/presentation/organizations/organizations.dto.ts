import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  superAdmin: number;
}

export class AssignDepartmentsDto {
  @IsArray()
  @IsNotEmpty()
  departmentIds: number[];
}

export class UpdateDepartmentsDto {
  @IsArray()
  @IsNotEmpty()
  departmentIds: number[];
}
