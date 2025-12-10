import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SupportAgent } from './entities/support-agent.entity';
import { SupportAgentsService } from './support-agents.service';
import { SupportAgentsController } from './support-agents.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportAgent]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_TOKEN_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SupportAgentsController],
  providers: [SupportAgentsService],
  exports: [SupportAgentsService],
})
export class SupportAgentsModule {}
