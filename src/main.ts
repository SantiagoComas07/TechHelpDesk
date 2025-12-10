import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn'] 
      : ['log', 'error', 'warn', 'debug'],
  });
  
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Enable CORS --
  const corsOrigin = configService.get('CORS_ORIGIN') || '*';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Support Management API')
    .setDescription('API REST para sistema de gestión de tickets de soporte')
    .setVersion('1.0')
    .addTag('Health', 'Estado de salud de la aplicacion')
    .addTag('Authentication', 'Endpoints de autenticación y registro')
    .addTag('Users', 'Gestión de usuarios del sistema')
    .addTag('Issue Categories', 'Categorías de problemas reportados')
    .addTag('Customers', 'Gestión de clientes')
    .addTag('Support Agents', 'Gestión de agentes de soporte')
    .addTag('Support Tickets', 'Gestión de tickets de soporte')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/documentation', app, document, {
    customSiteTitle: 'Support API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = configService.get('PORT') || 3000;
  const environment = configService.get('NODE_ENV') || 'development';
  
  await app.listen(port, '0.0.0.0');

  logger.log(`Application running on: http://localhost:${port}`);
  logger.log(`API Documentation: http://localhost:${port}/api/documentation`);
  logger.log(`API Base Path: http://localhost:${port}/api/v1`);
  logger.log(`Environment: ${environment}`);
  logger.log(`CORS Origin: ${corsOrigin}`);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});