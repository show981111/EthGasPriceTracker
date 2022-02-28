import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConfigService } from './config/database/mysql/configuration.service';
import { MysqlConfigModule } from './config/database/mysql/configuration.module';
import winston, { transport, transports, format } from 'winston';
import 'winston-daily-rotate-file';
import { GasModule } from './Gas/gas.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { WinstonModule } from 'nest-winston';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HTTPLoggingInterceptor } from './utils/HTTPlogging.interceptor';
import { AllExceptionsFilter } from './utils/Exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [MysqlConfigModule],
      useFactory: (MysqlConfigService: MysqlConfigService) => ({
        type: 'mysql',
        database: MysqlConfigService.database,
        host: MysqlConfigService.host,
        port: MysqlConfigService.port,
        username: MysqlConfigService.username,
        password: MysqlConfigService.password,
        entities: [__dirname + '/entities/*.entity.{js,ts}'],
        charset: 'utf8mb4_unicode_ci',
        logging: ['query', 'error'],
        timezone: '+00:00',
        synchronize: false,
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsRun: process.env.NODE_ENV == 'production' ? true : false,
      }),
      inject: [MysqlConfigService],
    }),
    ScheduleModule.forRoot(),
    GasModule,
    WinstonModule.forRoot({
      // options
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf((msg) => {
          return `${msg.timestamp} [${msg.level}] - ${msg.message}`;
        }),
      ),
      transports: [
        new transports.DailyRotateFile({
          level: 'info',
          filename: 'logs/info/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '14d',
        }),
        new transports.DailyRotateFile({
          level: 'error',
          filename: 'logs/error/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '14d',
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CronService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HTTPLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
