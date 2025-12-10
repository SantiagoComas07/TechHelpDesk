import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportAgent } from './entities/support-agent.entity';
import { CreateSupportAgentDto } from './dto/create-support-agent.dto';
import { UpdateSupportAgentDto } from './dto/update-support-agent.dto';

@Injectable()
export class SupportAgentsService {
  constructor(
    @InjectRepository(SupportAgent)
    private readonly supportAgentRepository: Repository<SupportAgent>,
  ) {}

  async create(createSupportAgentDto: CreateSupportAgentDto): Promise<SupportAgent> {
    const agent = this.supportAgentRepository.create(createSupportAgentDto);
    try {
      return await this.supportAgentRepository.save(agent);
    } catch (error) {
      throw new BadRequestException('Error creating support agent');
    }
  }

  async findAll(): Promise<SupportAgent[]> {
    return this.supportAgentRepository.find({
      relations: ['userAccount', 'assignedTickets'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SupportAgent> {
    const agent = await this.supportAgentRepository.findOne({
      where: { id },
      relations: ['userAccount', 'assignedTickets'],
    });
    if (!agent) {
      throw new NotFoundException(`Support agent with ID ${id} not found`);
    }
    return agent;
  }

  async update(id: string, updateSupportAgentDto: UpdateSupportAgentDto): Promise<SupportAgent> {
    await this.findOne(id);
    await this.supportAgentRepository.update(id, updateSupportAgentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const agent = await this.findOne(id);
    await this.supportAgentRepository.remove(agent);
  }

  async getAvailableAgents(): Promise<SupportAgent[]> {
    return this.supportAgentRepository.find({
      where: { isAvailable: true },
      relations: ['assignedTickets'],
    });
  }
}
