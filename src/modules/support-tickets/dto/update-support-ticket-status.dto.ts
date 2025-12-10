import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '@/shared/enums';

export class UpdateSupportTicketStatusDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}
