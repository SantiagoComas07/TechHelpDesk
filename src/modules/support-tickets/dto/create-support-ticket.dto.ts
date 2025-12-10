import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TicketStatus, TicketPriority } from '@/shared/enums';

export class CreateSupportTicketDto {
  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsUUID()
  issueCategoryId: string;

  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsUUID()
  assignedAgentId?: string;
}
