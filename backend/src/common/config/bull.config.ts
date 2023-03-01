import { BullModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

export const bullOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<BullModuleOptions> => ({
    limiter: {
      max: 100, // max: 작업을 얼마나 많이 처리할지 설정합니다.
      duration: 10000, // duration: 얼마나 오랫동안 대기열에 작업을 유지할지 설정합니다.
      bounceBack: false, // bounceBack: 작업 실패시 다시 시도할 것인지 여부를 설정합니다.
    },
    redis: {
      // host: Redis 서버의 호스트 이름을 설정합니다.
      host:
        configService.get('node.env') === 'production'
          ? configService.get('bull.prodhost')
          : configService.get('bull.devhost'),
      port: parseInt(configService.get('bull.port')), // port: Redis 서버의 포트 번호를 설정합니다.
    },
    prefix: 'backend-test', // prefix: 작업 이름 앞에 추가할 프리픽스를 설정합니다.
    defaultJobOptions: {
      attempts: 5, // attempts: 작업 재시도 횟수를 설정합니다.
      backoff: 1000, // backoff: 작업 재시도 간격을 설정합니다.
      timeout: 10000, // timeout: 작업 타임아웃을 설정합니다.
      removeOnComplete: true, // removeOnComplete: 작업 완료 후 대기열에서 작업을 제거할지 여부를 설정합니다.
      removeOnFail: 1000, // removeOnFail: 작업 실패 후 대기열에서 작업을 제거할 시간을 설정합니다.
    },
  }),
  // ConfigService를 주입합니다.
  inject: [ConfigService],
};
