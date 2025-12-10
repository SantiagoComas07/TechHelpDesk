import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateIssueCategoryDto {
  @IsString()
  categoryName: string;

  @IsOptional()
  @IsString()
  categoryDescription?: string;

  @IsOptional()
  @IsString()
  categoryCode?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
