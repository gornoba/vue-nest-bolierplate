import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  main,
  swagger,
  jwt,
  db,
  node,
  session,
  bull,
} from './common/config/env.config';
import { typeOrmModuleOptions } from 'src/common/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { bullOptions } from 'src/common/config/bull.config';
import { joi } from 'src/common/config/joi.config';
import { TemplateModule } from './template/template.module';
import { CommonModule } from './common/common.module';
import { ClientOpts } from '../node_modules/@types/redis/index.d';
import * as redisStore from 'cache-manager-redis-store';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: joi,
      isGlobal: true,
      cache: true,
      load: [main, swagger, jwt, db, node, bull, session],
    }),

    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    BullModule.forRootAsync(bullOptions),
    CacheModule.register<ClientOpts>({
      store: redisStore, // redis를 이용하기 위한 library load
      host:
        process.env.ENVIRONMENT === 'development'
          ? process.env.DEV_QUEUE_HOST
          : process.env.PROD_QUEUE_HOST, // host
      port: parseInt(process.env.QUEUE_PORT), // port
      db: 1, // db번호
      ttl: 0, // 유지시간
      prefix: 'cache',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '../../front'),
    }),
    TemplateModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}
}
