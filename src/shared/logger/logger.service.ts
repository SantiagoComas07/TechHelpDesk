import { Logger } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export class LoggerService {
  private logger: Logger;
  private winstonLogger: winston.Logger;

  constructor() {
    this.logger = new Logger('AppLogger');
    this.winstonLogger = this.createWinstonLogger();
  }

  private createWinstonLogger(): winston.Logger {
    const logLevel = process.env.LOG_LEVEL || 'debug';
    const isDevelopment = process.env.NODE_ENV === 'development';

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          winston.format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}${
              stack ? `\n${stack}` : ''
            }`;
          }),
          winston.format.colorize({ all: true }),
        ),
      }),
    ];

    if (!isDevelopment) {
      transports.push(
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: 14,
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
      );

      transports.push(
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: 14,
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
      );
    }

    return winston.createLogger({
      level: logLevel,
      transports,
    });
  }

  log(message: string, context?: string) {
    this.winstonLogger.info(message);
    if (context) {
      this.logger.log(message, context);
    }
  }

  error(message: string, trace?: string, context?: string) {
    this.winstonLogger.error(message);
    if (context) {
      this.logger.error(message, trace, context);
    }
  }

  warn(message: string, context?: string) {
    this.winstonLogger.warn(message);
    if (context) {
      this.logger.warn(message, context);
    }
  }

  debug(message: string, context?: string) {
    this.winstonLogger.debug(message);
    if (context) {
      this.logger.debug(message, context);
    }
  }

  verbose(message: string, context?: string) {
    this.winstonLogger.verbose(message);
    if (context) {
      this.logger.verbose(message, context);
    }
  }
}
