import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SupportAgentsService } from './support-agents.service';
import { CreateSupportAgentDto } from './dto/create-support-agent.dto';
import { UpdateSupportAgentDto } from './dto/update-support-agent.dto';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { RequireRoles } from '@/shared/decorators/roles.decorator';
import { UserRole } from '@/shared/enums';

@ApiTags('Support Agents')
@ApiBearerAuth('JWT-auth')
@Controller('support-agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportAgentsController {
  constructor(private readonly supportAgentsService: SupportAgentsService) {}

  @Post()
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Create a new support agent' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  async create(@Body() createSupportAgentDto: CreateSupportAgentDto) {
    return this.supportAgentsService.create(createSupportAgentDto);
  }

  @Get()
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Get all support agents' })
  @ApiResponse({ status: 200, description: 'List of all agents' })
  async findAll() {
    return this.supportAgentsService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available support agents' })
  @ApiResponse({ status: 200, description: 'List of available agents' })
  async getAvailable() {
    return this.supportAgentsService.getAvailableAgents();
  }

  @Get(':id')
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Get a specific support agent' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiResponse({ status: 200, description: 'Agent found' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.supportAgentsService.findOne(id);
  }

  @Patch(':id')
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Update a support agent' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiResponse({ status: 200, description: 'Agent updated successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSupportAgentDto: UpdateSupportAgentDto,
  ) {
    return this.supportAgentsService.update(id, updateSupportAgentDto);
  }

  @Delete(':id')
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Delete a support agent' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiResponse({ status: 204, description: 'Agent deleted successfully' })
  @ApiResponse({ status: 404, description: 'Agent not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.supportAgentsService.remove(id);
    return { message: 'Agent deleted successfully' };
  }
}
