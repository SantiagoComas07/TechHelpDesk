import { PartialType } from '@nestjs/swagger';
import { CreateSupportAgentDto } from './create-support-agent.dto';

export class UpdateSupportAgentDto extends PartialType(CreateSupportAgentDto) {}
