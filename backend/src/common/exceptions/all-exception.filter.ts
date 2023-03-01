import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { RecordRepository } from '../repositorys/record.repository';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly recordRepository: RecordRepository) {
    super();
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };
    const sessionId = request.session?.id;

    const payload = {
      result: false,
      url: request.url,
      status,
      message:
        typeof error === 'string' ? error : error.error + ' ' + error.message,
      method: request.method,
      session: sessionId,
    };

    await this.recordRepository.insertData(payload);
    this.logger.error(payload);

    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: typeof error === 'string' ? error : { ...error },
    });
  }
}
