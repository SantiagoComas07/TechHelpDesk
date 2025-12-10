import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IssueCategory } from './entities/issue-category.entity';
import { IssueCategoriesService } from './issue-categories.service';
import { IssueCategoriesController } from './issue-categories.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([IssueCategory]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_TOKEN_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [IssueCategoriesController],
  providers: [IssueCategoriesService],
  exports: [IssueCategoriesService],
})
export class IssueCategoriesModule {}
