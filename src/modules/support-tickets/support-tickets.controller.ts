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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SupportTicketsService } from './support-tickets.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';
import { UpdateSupportTicketStatusDto } from './dto/update-support-ticket-status.dto';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { RequireRoles } from '@/shared/decorators/roles.decorator';
import { UserRole, TicketStatus } from '@/shared/enums';

@ApiTags('Support Tickets')
@ApiBearerAuth('JWT-auth')
@Controller('support-tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportTicketsController {
  constructor(private readonly supportTicketsService: SupportTicketsService) {}

  @Post()
  @RequireRoles(UserRole.ADMINISTRATOR, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Create a new support ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  async create(@Body() createSupportTicketDto: CreateSupportTicketDto) {
    return this.supportTicketsService.create(createSupportTicketDto);
  }

  @Get()
  @RequireRoles(UserRole.ADMINISTRATOR, UserRole.AGENT)
  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiResponse({ status: 200, description: 'List of all tickets' })
  async findAll() {
    return this.supportTicketsService.findAll();
  }

  @Get('by-status/:status')
  @RequireRoles(UserRole.ADMINISTRATOR, UserRole.AGENT)
  @ApiOperation({ summary: 'Get tickets by status' })
  @ApiParam({ name: 'status', enum: TicketStatus })
  @ApiResponse({ status: 200, description: 'List of tickets with specified status' })
  async findByStatus(@Param('status') status: TicketStatus) {
    return this.supportTicketsService.findByStatus(status);
  }

  @Get('by-customer/:customerId')
  @RequireRoles(UserRole.CUSTOMER, UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Get tickets for a specific customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'List of customer tickets' })
  async findByCustomer(@Param('customerId', new ParseUUIDPipe()) customerId: string) {
    return this.supportTicketsService.findByCustomer(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket found' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.supportTicketsService.findOne(id);
  }

  @Patch(':id')
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSupportTicketDto: UpdateSupportTicketDto,
  ) {
    return this.supportTicketsService.update(id, updateSupportTicketDto);
  }

  @Patch(':id/status')
  @RequireRoles(UserRole.ADMINISTRATOR, UserRole.AGENT)
  @ApiOperation({ summary: 'Update ticket status' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket status updated' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateStatusDto: UpdateSupportTicketStatusDto,
  ) {
    return this.supportTicketsService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/assign/:agentId')
  @RequireRoles(UserRole.ADMINISTRATOR, UserRole.AGENT)
  @ApiOperation({ summary: 'Assign ticket to an agent' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiParam({ name: 'agentId', description: 'Agent ID' })
  @ApiResponse({ status: 200, description: 'Ticket assigned successfully' })
  @ApiResponse({ status: 404, description: 'Ticket or agent not found' })
  async assignTicket(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('agentId', new ParseUUIDPipe()) agentId: string,
  ) {
    return this.supportTicketsService.assignTicket(id, agentId);
  }

  @Delete(':id')
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 204, description: 'Ticket deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.supportTicketsService.remove(id);
    return { message: 'Ticket deleted successfully' };
  }
}
