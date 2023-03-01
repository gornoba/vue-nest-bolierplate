import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RecordRepository } from '../repositorys/record.repository';

@Injectable()
export class RecordInterceptor implements NestInterceptor {
  private logger = new Logger(RecordInterceptor.name);

  constructor(private readonly recordRepository: RecordRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const sessionId = request.session?.id;
        const now = Date.now();

        const latency = Date.now() - now;
        const payload = {
          method,
          url,
          latency,
          status: 200,
          result: true,
          session: sessionId,
        };

        if (!/dynamic/.test(url)) {
          await this.recordRepository.insertData(payload);
          this.logger.log(`${method} ${url} ${latency}ms`);
        }
      }),
    );
  }
}
