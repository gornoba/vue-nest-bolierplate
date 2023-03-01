import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolve } from 'path';

export const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres', // (string): 데이터베이스 유형을 나타냅니다.
    // (string): 데이터베이스 호스트 주소를 나타냅니다.
    host:
      configService.get('node.env') === 'production'
        ? configService.get('db.prodhost')
        : configService.get('db.devhost'),
    username: configService.get('db.username'), // (string): 데이터베이스 사용자 이름을 나타냅니다.
    password: configService.get('db.password'), // (string): 데이터베이스 비밀번호를 나타냅니다.
    database: configService.get('db.database'), // (string): 데이터베이스 이름을 나타냅니다.
    schema: configService.get('db.schema'), // (string): 데이터베이스 스키마 이름을 지정합니다.
    //  (any[]): TypeORM에서 사용할 엔티티 클래스 배열을 나타냅니다.
    entities:
      configService.get('node.env') === 'production'
        ? [resolve(__dirname + '../dist/**/*.entity{.ts,.js}')]
        : [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: configService.get('node.env') === 'production' ? false : true, // true로 설정하면 TypeORM이 데이터베이스 스키마를 자동으로 생성합니다. 개발 환경에서만 사용하는 것이 좋습니다.
    autoLoadEntities:
      configService.get('node.env') === 'production' ? false : true, // (boolean): 애플리케이션에서 엔티티 모든 클래스를 자동으로 로드합니다.
    logging:
      configService.get('node.env') === 'production'
        ? false
        : ['query', 'error'], //  (boolean | string | string[]): 로깅을 활성화합니다. true를 지정하면 모든 쿼리가 로깅됩니다. 문자열을 전달하면 로깅 레벨을 지정할 수 있습니다.
    extra: {
      max: 100, // 최대 연결 개수
      idleTimeoutMillis: 3000, // 유휴 연결 시간
      socketPath: configService.get('db.prodhost'), // GCP의 Unix 도메인 소켓 파일 경로를 설정
      timezone: 'Asia/Seoul',
    },
  }),
  inject: [ConfigService],
};
