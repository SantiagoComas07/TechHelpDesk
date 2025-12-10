import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateSupportAgentDto {
  @IsString()
  agentName: string;

  @IsString()
  specialization: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  maxConcurrentTickets?: number;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsString()
  userAccountId: string;
}
