import { ConfigService } from '@nestjs/config';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JwtConfig {
  secret: string;
  expiration: string;
}

export interface AppConfig {
  port: number;
  environment: Environment;
  corsOrigin: string;
  logLevel: string;
}

export class ConfigHelper {
  constructor(private configService: ConfigService) {}

  getEnvironment(): Environment {
    return (this.configService.get('NODE_ENV') || Environment.Development) as Environment;
  }

  isDevelopment(): boolean {
    return this.getEnvironment() === Environment.Development;
  }

  isProduction(): boolean {
    return this.getEnvironment() === Environment.Production;
  }

  isTest(): boolean {
    return this.getEnvironment() === Environment.Test;
  }

  getAppConfig(): AppConfig {
    return {
      port: this.configService.get('PORT') || 3000,
      environment: this.getEnvironment(),
      corsOrigin: this.configService.get('CORS_ORIGIN'),
      logLevel: this.configService.get('LOG_LEVEL') ,
    };
  }

  getDatabaseConfig(): DatabaseConfig {
    return {
      host: this.configService.get('DATABASE_HOST') ,
      port: this.configService.get('DATABASE_PORT') ,
      username: this.configService.get('DATABASE_USER') ,
      password: this.configService.get('DATABASE_PASSWORD') ,
      database: this.configService.get('DATABASE_NAME') ,
    };
  }

  getJwtConfig(): JwtConfig {
    return {
      secret: this.configService.get('JWT_SECRET_KEY') ,
      expiration: this.configService.get('JWT_TOKEN_EXPIRATION') ,
    };
  }
}
