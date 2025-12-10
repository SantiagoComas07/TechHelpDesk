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
import { IssueCategoriesService } from './issue-categories.service';
import { CreateIssueCategoryDto } from './dto/create-issue-category.dto';
import { UpdateIssueCategoryDto } from './dto/update-issue-category.dto';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { RequireRoles } from '@/shared/decorators/roles.decorator';
import { UserRole } from '@/shared/enums';

@ApiTags('Issue Categories')
@ApiBearerAuth('JWT-auth')
@Controller('issue-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IssueCategoriesController {
  constructor(private readonly issueCategoriesService: IssueCategoriesService) {}

  @Post()
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Create a new issue category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async create(@Body() createIssueCategoryDto: CreateIssueCategoryDto) {
    return this.issueCategoriesService.create(createIssueCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all issue categories' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  async findAll() {
    return this.issueCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific issue category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.issueCategoriesService.findOne(id);
  }

  @Patch(':id')
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Update an issue category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateIssueCategoryDto: UpdateIssueCategoryDto,
  ) {
    return this.issueCategoriesService.update(id, updateIssueCategoryDto);
  }

  @Delete(':id')
  @RequireRoles(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Delete an issue category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.issueCategoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
