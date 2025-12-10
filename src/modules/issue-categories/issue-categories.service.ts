import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueCategory } from './entities/issue-category.entity';
import { CreateIssueCategoryDto } from './dto/create-issue-category.dto';
import { UpdateIssueCategoryDto } from './dto/update-issue-category.dto';

@Injectable()
export class IssueCategoriesService {
  constructor(
    @InjectRepository(IssueCategory)
    private readonly issueCategoryRepository: Repository<IssueCategory>,
  ) {}

  async create(createIssueCategoryDto: CreateIssueCategoryDto): Promise<IssueCategory> {
    const category = this.issueCategoryRepository.create(createIssueCategoryDto);
    return this.issueCategoryRepository.save(category);
  }

  async findAll(): Promise<IssueCategory[]> {
    return this.issueCategoryRepository.find({
      order: { displayOrder: 'ASC' },
    });
  }

  async findOne(id: string): Promise<IssueCategory> {
    const category = await this.issueCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Issue category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateIssueCategoryDto: UpdateIssueCategoryDto): Promise<IssueCategory> {
    await this.findOne(id);
    await this.issueCategoryRepository.update(id, updateIssueCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.issueCategoryRepository.remove(category);
  }
}
