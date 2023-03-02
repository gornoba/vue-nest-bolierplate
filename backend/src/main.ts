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
  app.useGlobalFilters(new AllExceptionFilter(app.get(RecordRepository))); // exception filter
  app.useGlobalInterceptors(new RecordInterceptor(app.get(RecordRepository)));
  app.useGlobalInterceptors(new SuccessInterceptor()); // success interceptor
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 이 옵션을 true로 설정하면 DTO에 정의된 속성 값이 자동으로 변환됩니다. 예를 들어, @IsInt()로 정수 형식의 값만 입력받도록 지정된 속성에 "123"이라는 문자열이 들어온 경우 자동으로 123으로 변환됩니다. 기본값은 false이며, transform이 true일 경우 변환 중 오류가 발생하면 ValidationException이 발생합니다.
      skipNullProperties: false, // true로 설정하면 입력 데이터 객체에 null인 속성이 있으면 검증에서 제외됩니다. 기본값은 false입니다.
      skipMissingProperties: false, // 이 옵션을 true로 설정하면 DTO에 정의된 속성 중 하나라도 누락된 경우 유효성 검사를 건너뜁니다. 기본값은 false이며, 누락된 속성은 유효하지 않은 값으로 처리됩니다.
      skipUndefinedProperties: false, // 이 옵션을 true로 설정하면 DTO에 정의된 속성 중 undefined인 경우 유효성 검사를 건너뜁니다. 기본값은 false이며, undefined인 속성은 유효하지 않은 값으로 처리됩니다.
      forbidUnknownValues: false, // 이 옵션을 true로 설정하면 DTO에 정의되지 않은 속성이 들어온 경우 유효성 검사를 실패시킵니다. 기본값은 false이며, 이 경우 정의되지 않은 속성은 무시됩니다.
      whitelist: false, // 이 옵션을 true로 설정하면 DTO에 정의된 속성만 허용합니다. 즉, DTO에 정의되지 않은 속성이 들어온 경우 유효성 검사를 실패시킵니다. 기본값은 false이며, 이 경우 정의되지 않은 속성은 무시됩니다.
      forbidNonWhitelisted: false, //  true로 설정하면 whitelist 옵션이 true일 때 입력 데이터 객체에 존재하지 않는 속성이 있으면 검증 실패를 유발합니다. 기본값은 false입니다.
    }),
  );
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
