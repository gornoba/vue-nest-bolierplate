import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter } from './common/exceptions/all-exception.filter';
import { SuccessInterceptor } from './common/interceptors/success.intercepter';
import * as session from 'express-session';
import { RecordInterceptor } from './common/interceptors/record.interceptor';
import { RecordRepository } from './common/repositorys/record.repository';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('bootstrap');
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api'); // prefix
  middlewere(app, configService);
  nestMiddleware(app);
  network(app, configService);
  swagger(app, configService);

  try {
    await app.listen(configService.get('main.port'));
    logger.log(`${configService.get('main.port')} server start`);
  } catch (err) {
    logger.error(err);
  }
}

function network(app: NestExpressApplication, configService: ConfigService) {
  // cors
  app.enableCors({
    origin: configService.get('main.cors'),
    credentials: true,
  });

  // helmet
  const cspOptions = {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'default-src': configService.get('main.cspOptions1'),
      'script-src': configService.get('main.cspOptions1'),
      'img-src': configService.get('main.cspOptions1'),
      'connect-src': configService.get('main.cspOptions2'),
    },
  };
  app.use(
    helmet({
      contentSecurityPolicy: cspOptions,
      crossOriginEmbedderPolicy: false,
    }),
  );
}

function swagger(app: NestExpressApplication, configService: ConfigService) {
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [configService.get('swagger.user')]:
          configService.get('swagger.password'),
      },
    }),
  );

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Boilerplate APIs')
        .setDescription('')
        .setVersion('1.0')
        .build(),
    ),
  );
}

function nestMiddleware(app: NestExpressApplication) {
  // app.useGlobalFilters(new AllExceptionFilter(app.get(RecordRepository))); // exception filter
  // app.useGlobalInterceptors(new RecordInterceptor(app.get(RecordRepository)));
  app.useGlobalInterceptors(new SuccessInterceptor()); // success interceptor
}

function middlewere(app: NestExpressApplication, configService: ConfigService) {
  app.use(cookieParser()); // cookie-parser
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
      },
    }),
  ); // session
}

bootstrap();
