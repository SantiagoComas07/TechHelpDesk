import { PartialType } from '@nestjs/swagger';
import { CreateIssueCategoryDto } from './create-issue-category.dto';

export class UpdateIssueCategoryDto extends PartialType(CreateIssueCategoryDto) {}
