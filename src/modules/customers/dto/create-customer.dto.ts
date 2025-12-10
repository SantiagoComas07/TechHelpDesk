import { IsString, IsOptional, IsEmail, IsUUID } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsEmail()
  primaryEmail: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsUUID()
  userAccountId: string;
}
