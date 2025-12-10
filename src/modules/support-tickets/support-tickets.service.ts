import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from './entities/support-ticket.entity';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';
import { UpdateSupportTicketStatusDto } from './dto/update-support-ticket-status.dto';
import { TicketStatus } from '@/shared/enums';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepository: Repository<SupportTicket>,
  ) {}

  async create(createSupportTicketDto: CreateSupportTicketDto): Promise<SupportTicket> {
    const ticket = this.supportTicketRepository.create(createSupportTicketDto);
    try {
      return await this.supportTicketRepository.save(ticket);
    } catch (error) {
      throw new BadRequestException('Error creating ticket. Check if category and customer exist.');
    }
  }

  async findAll(): Promise<SupportTicket[]> {
    return this.supportTicketRepository.find({
      relations: ['issueCategory', 'customer', 'assignedAgent', 'customer.userAccount'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: TicketStatus): Promise<SupportTicket[]> {
    return this.supportTicketRepository.find({
      where: { status },
      relations: ['issueCategory', 'customer', 'assignedAgent', 'customer.userAccount'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomer(customerId: string): Promise<SupportTicket[]> {
    return this.supportTicketRepository.find({
      where: { customerId },
      relations: ['issueCategory', 'assignedAgent'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SupportTicket> {
    const ticket = await this.supportTicketRepository.findOne({
      where: { id },
      relations: ['issueCategory', 'customer', 'assignedAgent', 'customer.userAccount'],
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async update(id: string, updateSupportTicketDto: UpdateSupportTicketDto): Promise<SupportTicket> {
    await this.findOne(id);
    await this.supportTicketRepository.update(id, updateSupportTicketDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, updateStatusDto: UpdateSupportTicketStatusDto): Promise<SupportTicket> {
    const ticket = await this.findOne(id);
    
    const updateData: any = { status: updateStatusDto.status };
    
    if (updateStatusDto.resolutionNotes) {
      updateData.resolutionNotes = updateStatusDto.resolutionNotes;
    }
    
    if (updateStatusDto.status === TicketStatus.RESOLVED) {
      updateData.resolvedAt = new Date();
    }
    
    await this.supportTicketRepository.update(id, updateData);
    return this.findOne(id);
  }

  async assignTicket(ticketId: string, agentId: string): Promise<SupportTicket> {
    const ticket = await this.findOne(ticketId);
    await this.supportTicketRepository.update(ticketId, {
      assignedAgentId: agentId,
      assignedAt: new Date(),
    });
    return this.findOne(ticketId);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.supportTicketRepository.remove(ticket);
  }
}
